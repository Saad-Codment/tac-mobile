import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {hp, wp} from '../Config/responsive';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import {radioCircle, radioCircleOn} from '../Assets';
import {useMutation, useQuery} from '@tanstack/react-query';
import {getReasonsUrl, reportEventUrl} from '../Utils/Urls';
import API from '../Utils/helperFunc';
import KeyBoardWrapper from './KeyBoardWrapper';
import ThemeButton from './ThemeButton';
import {errorMessage, successMessage} from '../Config/NotificationMessage';

const BottomModalComponent = ({
  isVisible,
  onClose,
  children,
  showCenter,
  isReport,
  event_id,
}) => {
  const {data} = useQuery({
    queryKey: ['reasons'],
    queryFn: () => API.get(getReasonsUrl),
  });

  const [selectedVal, setSelectedVal] = useState(null);

  const [message, setMessage] = useState(null);

  const {mutate, mutateAsync} = useMutation({
    mutationFn: data => {
      return API.post(reportEventUrl, {
        event_id,
        reason_id: selectedVal.id,
        message,
      });
    },
    onSuccess: ({ok, data}) => {
      if (ok) {
        successMessage(data?.message);
      } else {
        console.log('jkdsbkljsdbvklsdbvklsbklvsvd', data);
        errorMessage(data?.message);
      }
    },
    onError: () => {
      errorMessage('Network request failed.');
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{
        justifyContent: showCenter ? 'center' : 'flex-end',

        margin: 0,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 25,
          margin: showCenter ? 10 : 0,
          borderTopLeftRadius: !showCenter ? 30 : 10,
          borderTopRightRadius: !showCenter ? 30 : 10,
          width: showCenter ? wp('85') : wp('100'),
          alignSelf: 'center',
          borderRadius: !showCenter ? 0 : 10,
        }}>
        {isReport ? (
          <KeyBoardWrapper>
            <TextComponent
              text={'Report this set'}
              styles={styles.modalHeading}
            />
            <TextComponent
              text={'Why is this inappropriate?'}
              styles={styles.innerHeading}
            />
            {data?.data &&
              data?.data.map(res => {
                return (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Touchable onPress={() => setSelectedVal(res)}>
                      <Image
                        source={
                          res?.id == selectedVal?.id
                            ? radioCircleOn
                            : radioCircle
                        }
                        resizeMode="contain"
                        style={styles.leftViewImg}
                      />
                    </Touchable>
                    <TextComponent
                      onPress={() => setSelectedVal(res)}
                      text={res?.name}
                      styles={styles.reportMessStyle}
                    />
                  </View>
                );
              })}
            {selectedVal?.name == 'Other' && (
              <View style={styles.inputView}>
                <TextInput
                  placeholder="Please type your issue"
                  placeholderTextColor={'gray'}
                  value={message}
                  onChangeText={e => setMessage(e)}
                  style={{
                    overflow: 'scroll',
                    alignSelf: 'flex-start',
                    color: 'black',
                  }}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                width: wp('87'),
                justifyContent: 'space-between',
                marginTop: hp('2'),
              }}>
              <ThemeButton
                title={'Cancel'}
                style={{width: wp('40'), height: hp('5')}}
                onPress={onClose}
              />
              <ThemeButton
                title={'Submit'}
                isYellowTheme
                style={{width: wp('40'), height: hp('5')}}
                onPress={() => {
                  onClose();
                  mutate();
                }}
              />
            </View>
          </KeyBoardWrapper>
        ) : (
          children
        )}
        {/* <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
          }}></TouchableOpacity> */}
      </View>
    </Modal>
  );
};

export default BottomModalComponent;

const styles = StyleSheet.create({
  modalHeading: {alignSelf: 'center', fontWeight: 'bold'},
  innerHeading: {fontWeight: 'bold', marginVertical: hp('5')},
  viewFlex: {flexDirection: 'row'},
  textStyle: {fontSize: hp('1.5')},
  leftViewImg: {width: wp('7'), height: hp('5')},
  reportMessStyle: {
    fontSize: hp('1.5'),
    marginLeft: wp('2'),
    maxWidth: wp('80'),
  },
  inputView: {
    width: wp('87'),
    alignSelf: 'center',
    height: hp('10'),
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'black',
    paddingVertical: hp('0.5'),
    paddingHorizontal: wp('1'),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
