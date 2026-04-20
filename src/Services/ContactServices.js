import contact from 'react-native-contacts';
import API from '../Utils/helperFunc';
import {sendNumberToServerUrl, sendUpdatedAtUrl} from '../Utils/Urls';
import SQLite from '@boltcode/react-native-sqlite-storage';
import {store} from '../Redux/Reducer';
import {types} from '../Redux/types';
import {getLastNightDigit, hashPassword} from './GlobalFunctions';

const {Platform, PermissionsAndroid, Alert} = require('react-native');
const {
  PERMISSIONS,
  check,
  openSettings,
  request,
} = require('react-native-permissions');

function errorCB(err) {
  console.log('SQL Error: ' + err);
}

function openCB() {
  console.log('Database OPENED');
}

export let db = SQLite.openDatabase(
  'userContact.db',
  '1.0',
  'Contact Database',
  200000,
  openCB,
  errorCB,
);

const perSKU = Platform.select({
  ios: PERMISSIONS.IOS.CONTACTS,
});

const checkContactPer = async () => {
  if (Platform.OS == 'ios') {
    const status = await check(perSKU);
    console.log('statusstatusstatusstatusstatus', status);
    if (status == 'granted') return true;
    else return false;
  } else if (Platform.OS == 'android') {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    console.log('grantedgrantedgrantedgrantedgranted', granted);
    if (granted == PermissionsAndroid.RESULTS.GRANTED || granted == true)
      return true;
  } else return false;
};

const checkContactPermission = async () => {
  if (Platform.OS == 'ios') {
    const status = await checkContactPer();
    console.log('statusstatusstatusstatusstatus', status);
    if (status == true) return true;
    else {
      const req = await request(perSKU);
      if (req == 'granted') return true;
      else {
        Alert.alert(
          'Warning',
          `Please allow you contact permission to create trip..`,
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Open Setting',
              onPress: () => {
                openSettings().catch(() =>
                  console.warn('Cannot open settings'),
                );
              },
            },
          ],
          {
            userInterfaceStyle: 'light',
          },
        );
        return false;
      }
    }
  } else if (Platform.OS == 'android') {
    const ch = await checkContactPer();
    if (ch == true) return true;
    else {
      const req = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (req == PermissionsAndroid.RESULTS.GRANTED) return true;
      else {
        Alert.alert(
          'Warning',
          `Please allow you contact permission to create trip..`,
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Open Setting',
              onPress: () => {
                openSettings().catch(() =>
                  console.warn('Cannot open settings'),
                );
              },
            },
          ],
          {
            userInterfaceStyle: 'light',
          },
        );
        return false;
      }
    }
  }
};

const checkPermissionHandler = async () => {
  const checkPer = await contact.checkPermission();
  console.log('checkPercheckPercheckPercheckPercheckPer', checkPer);
  if (checkPer == 'authorized') return true;
  else {
    console.log('reqPerreqPerreqPerreqPerreqPer');
    const reqPer = await contact.requestPermission();
    if (reqPer == 'authorized') return true;
    else {
      Alert.alert(
        'Warning',
        `Please allow you contact permission to create trip..`,
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Open Setting',
            onPress: () => {
              openSettings().catch(() => console.warn('Cannot open settings'));
            },
          },
        ],
        {
          userInterfaceStyle: 'light',
        },
      );
      return false;
    }
  }
};

const perAlertBox = () => {
  Alert.alert(
    'Warning',
    `Please allow you contact permission to create trip..`,
    [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Open Setting',
        onPress: () => {
          openSettings().catch(() => console.warn('Cannot open settings'));
        },
      },
    ],
    {
      userInterfaceStyle: 'light',
    },
  );
};

const removeSpaceFromNumber = num => {
  return num.map(number => number.replace(/\s/g, ''));
};

const checkContactToSql = async sqlContacts => {
  const confirmPer = await checkContactPermission();
  if (confirmPer) {
    const phoneBookContact = await contact.getAll();
    console.log(
      'confirmPerconfirmPerconfirmPerconfirmPerconfirmPerconfirsdsdmPerconfirmPerconfirmPerconfirmPerconfirmPer',
      phoneBookContact,
    );
    const filterContact = filterNumberFromArry(phoneBookContact);
    console.log(
      'sqlContactssqlContactssqlContasdfctssqlContactssqlContactssqlContacts',
      sqlContacts,
      filterContact,
    );
    // Extract phone numbers into an array
    const phoneNumbers =
      sqlContacts != undefined && sqlContacts != null
        ? [...sqlContacts].map(item => item.phone)
        : [];
    const removeSpace = removeSpaceFromNumber(filterContact);
    const checkNewContact = [
      ...removeSpace.filter(value => !phoneNumbers.includes(value)),
      // ...phoneNumbers.filter(value => !filterContact.includes(value)),
    ];
    console.log(
      'checkNewContactcheckNewContasdsdsctcheckNewContact',
      checkNewContact,
      ...removeSpace.filter(value => !phoneNumbers.includes(value)),
    );
    // Remove spaces from each number
    let numbersWithoutSpaces = removeSpaceFromNumber(checkNewContact);

    return numbersWithoutSpaces;
  } else if (!confirmPer && Platform.OS == 'android') {
    perAlertBox();
  }
  return null;
};

const updateDataAccourdingToId = updateData => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  db.transaction(tx => {
    const userId = userData.id;
    const phonebookData = updateData.book; // JSON data as a string
    const updatedAt = updateData.updated_at; // Current timestamp

    console.log(
      'lksdvklsdbklvbsdklvbsdlkbvlksdbvlsbdlvbsdlkvbsdk',
      phonebookData,
    );

    tx.executeSql(
      'UPDATE phonebook SET book = ?, updated_at = ? WHERE user_id = ?',
      [phonebookData, updatedAt, userId],
      (tx, results) => {
        console.log(`Rows affected: ${results.rowsAffected}`);
      },
      (tx, error) => {
        console.error(`Error updating data: ${error.message}`);
      },
    );
  });
};

const getContactFromSql = async () => {
  console.log('lskdnklnsdklfnsdklfnklsdn', db);
  const {
    Auth: {userData},
  } = store.getState('Auth');
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM phonebook WHERE user_id = ?`,
      [userData.id], // Replace 1 with the desired user_id value
      async (tx, results) => {
        const len = results.rows.length;
        console.log('klsdnklnskdfnsdkfnksdn', len);
        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          console.log(
            'row.bookrow.bookrow.bookrow.bookrow.bookrow.bookrow.bookrow.book',
            JSON.parse(row.book),
          );
          await store.dispatch({
            type: types.addContacts,
            payload: row?.book ? JSON.parse(row.book) : [],
          });
          // contacts.book = await JSON.parse(row.book);
          // contacts = await JSON.parse(row.book);
        }
      },
      (yx, error) => {
        console.log('lksdnknsdlkfbkjsdbfjksbdjkfbsdjbfjsdbfbsdbfsd', error);
      },
    );
  });
};

const sendUpdatedAt = async () => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM phonebook WHERE user_id = ?`,
      [userData.id], // Replace 1 with the desired user_id value
      async (tx, results) => {
        const len = results.rows.length;
        for (let i = 0; i < len; i++) {
          const row = results.rows.item(i);
          const checkData = Boolean(
            row?.book != null && row?.book != undefined && row?.book != '',
          );
          console.log('rowrowrowrowrowrowrowrowrowrow', row);
          store.dispatch({
            type: types.addContacts,
            payload: checkData ? JSON.parse(row.book) : [],
          });
          const newContacts = await checkContactToSql(
            checkData ? JSON.parse(row.book) : undefined,
          );
          const nightDigit = await getLastNightDigit(newContacts);
          console.log(
            'nightDigitnightDigitnightDigitnightDigitnightDigitnightDigit',
            nightDigit,
          );

          const hashedNumber = await Promise.all(
            nightDigit.map(async res => {
              const {hashed} = await hashPassword(res);
              return hashed;
            }),
          );

          const {ok, data} = await API.post(sendUpdatedAtUrl, {
            updated_at: row.updated_at,
            book: hashedNumber,
          });

          const phoneBook = await contact.getAll();

          if (ok) {
            console.log('data.bookdata.bookdata.book', data);
            const afterGetAllNumber = await removeDuplicatesNumberFromArry(
              data.book.length > 0 ? data.book : [],
              filterNumberAndNameFromArry(phoneBook),
            );

            console.log(
              'afterGetAllNumberafterGetAllNumberafterGetAllNumberafterGetAllNumberafterGetAllNumber',
              afterGetAllNumber,
            );
            store.dispatch({
              type: types.addContacts,
              payload: afterGetAllNumber,
            });
            if (data?.book?.length > 0) {
              updateDataAccourdingToId({
                ...data,
                book: convertToFormattedString(afterGetAllNumber),
              });
            }
          }
          console.log(`Oget by userID   User ID: ${newContacts}`);
        }
      },
    );
  });
};

const filterNumberFromArry = phoneBook => {
  const phoneNumbersArray = phoneBook.map(
    contact => contact?.phoneNumbers[0]?.number,
  );
  const filteredPhoneNumbers = phoneNumbersArray.filter(
    number => number !== undefined,
  );
  // const hashedNumbers = await Promise.all(
  //   filteredPhoneNumbers.map(async res => {
  //     const {hashed} = await hashPassword(res);
  //     return hashed;
  //   }),
  // );

  return filteredPhoneNumbers;
};
const filterNumberAndNameFromArry = phoneBook => {
  const phoneNumbersArray = phoneBook.map(contact => ({
    name: contact?.givenName,
    phone: contact?.phoneNumbers[0]?.number,
    id: contact?.recordID,
  }));
  const filteredPhoneNumbers = phoneNumbersArray.filter(
    obj => obj?.phone !== undefined,
  );
  return filteredPhoneNumbers;
};

function addInAppKeyToArray(arr) {
  return arr.map(item => {
    return {
      ...item,
      inApp: true, // Add the new key `inApp` with a value, here set as `true`
    };
  });
}

function convertToFormattedString(arr) {
  // Map the existing array to match the desired format
  const formattedArray = arr.map((item, index) => {
    return item;
  });

  // Convert the array to a JSON string format
  return JSON.stringify(formattedArray);
}

const removeDuplicatesNumberFromArry = async (arry1, arry2) => {
  // Parse the first array since it's a JSON string

  // Combine both arrays
  const combinedArray = [...addInAppKeyToArray(arry1), ...arry2];

  // Create an object to store unique entries by 'number'
  const uniqueItems = {};

  // Loop through the combined array and add unique values based on 'number'
  combinedArray.map(item => {
    // Normalize the 'number' by removing non-digit characters (for consistent comparison)
    const normalizedNumber = item?.inApp
      ? item.phone.replace(/\D/g, '')
      : item.phone;

    // Only add the item if the 'number' hasn't been added yet
    if (!uniqueItems[normalizedNumber]) {
      uniqueItems[normalizedNumber] = item;
    }
  });

  // Return the unique items as an array
  return Object.values(uniqueItems);
};

const sendPhoneBookTOServer = async isPerContact => {
  const {
    Auth: {userData},
  } = store.getState('Auth');
  const confirmPer = isPerContact ?? (await checkContactPermission());
  if (confirmPer) {
    const phoneBook = await contact.getAll();
    console.log(
      'kjsdbkjlvbskjsdbklsbdklvbsdklvbsdkv',
      filterNumberFromArry(phoneBook),
    );
    const removeSpace = removeSpaceFromNumber(filterNumberFromArry(phoneBook));
    console.log(
      'removeSpaceremoveSpaceremoveSpaceremoveSpaceremoveSpacesdvsd',
      removeSpace,
    );
    const nightDigit = await getLastNightDigit(removeSpace);

    console.log(
      'nightDigitnightDigitnightDigitnightDigitnightDigitnightDigitnightDigit0',
      nightDigit,
    );

    const hashedNumber = await Promise.all(
      nightDigit.map(async res => {
        const {hashed} = await hashPassword(res);
        return hashed;
      }),
    );

    console.log(
      'hashedNumberhashedNumberhashedNumberhashedNumberhashedNumberhashedNumberhashedNumber',
      hashedNumber,
    );

    const {ok, data} = await API.post(sendNumberToServerUrl, {
      book: hashedNumber,
    });
    console.log(
      'sjkdnkfnsdknfsdklnflksdnfknsdlfnsdlnfsdklfsdfsdfsdfsdfsdfsdfds',
      data,
    );

    if (ok) {
      const afterGetAllNumber = await removeDuplicatesNumberFromArry(
        data.book.length > 0 ? JSON.parse(data.book) : [],
        filterNumberAndNameFromArry(phoneBook),
      );

      const hashedNumbers = await Promise.all(
        afterGetAllNumber.map(async res => {
          const {hashed} = await hashPassword(res?.phone);
          return hashed;
        }),
      );

      // const hashedNumbers = await afterGetAllNumber.map(async res => {
      //   const {hashed} = await hashPassword(res?.phone);
      //   return hashed;
      // });

      console.log(
        'kjbkjbjkbsjkbdjkbfksdbfbsdjbsdjkfbsdkbfbdsbfjsdbjkasdasdasdasdasbjksd',
        hashedNumbers,
        afterGetAllNumber,
        // convertToFormattedString(afterGetAllNumber),
        // JSON.stringify(convertToFormattedString(afterGetAllNumber)),
      );
      // console.log(
      //   'kjbkjbjkbsjkbdjkbfksdbfbsdjbsdjkfbsdkbfbdsbfjsdbjkasdasdasdasdasbjksd',
      //   convertToFormattedString(afterGetAllNumber),
      //   JSON.stringify(convertToFormattedString(afterGetAllNumber)),
      // );

      store.dispatch({
        type: types.addContacts,
        payload: afterGetAllNumber,
      });

      // Create the phonebook table
      db.transaction(tx => {
        tx.executeSql(`
    CREATE TABLE IF NOT EXISTS phonebook (
      user_id INTEGER PRIMARY KEY,
      book TEXT,
      updated_at TEXT
    )
  `);
        // Example: Insert data into the phonebook table
        const userId = userData?.id;
        const phonebookData =
          afterGetAllNumber.length > 0
            ? convertToFormattedString(afterGetAllNumber)
            : undefined; // JSON data as a string
        const updatedAt = data.updated_at; // Current timestamp

        console.log(
          'phonebookDataphonebookDataphonebookDataphonebookDataphonebookDataphonebookDataphonebookData',
          phonebookData,
        );

        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO phonebook (user_id, book, updated_at) VALUES (?, ?, ?)',
            [userId, phonebookData, updatedAt],
          );
        });

        // Example: Query data from the phonebook table
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM phonebook', [], (tx, results) => {
            const len = results.rows.length;
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              console.log(
                `On Create   User ID: ${row.user_id}, Phonebook: ${row.book}, Updated At: ${row.updated_at}`,
              );
            }
          });
        });
      });
    } else {
      console.log('khjsdbjkvdjfsvdf', data);
    }
  } else if (!confirmPer && Platform.OS == 'android') {
    perAlertBox();
  }
};

const checkSqlDataBase = () => {
  // Example: Query data from the phonebook table
  db.transaction(tx => {
    if (tx.success) {
      tx.executeSql('SELECT * FROM phonebook', [], (tx, results) => {
        const len = results.rows.length;
        console.log('kenthsugdugsudgsugdusgdugsdgs', len);
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            const row = results.rows.item(i);
            sendUpdatedAt();
            console.log(
              `On GET User ID: ${row.user_id}, Phonebook: ${row.book}, Updated At: ${row.updated_at}`,
            );
          }
        }
      });
    } else {
      sendPhoneBookTOServer();
    }
  });
};

export {
  checkContactPermission,
  sendPhoneBookTOServer,
  checkSqlDataBase,
  sendUpdatedAt,
  getContactFromSql,
  getLastNightDigit,
  checkContactPer,
};
