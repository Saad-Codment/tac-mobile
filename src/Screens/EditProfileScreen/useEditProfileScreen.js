import {useState} from 'react';
const {default: useFormHook} = require('../../Hooks/UseFormHooks');
const {default: Schemas} = require('../../Utils/Validation');

const EditProfileScreen = ({navigate}) => {
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.signUp,
  );

  const [age, setAge] = useState(18);
  const ageRange = Array.from({length: 23}, (_, i) => {
    const age = 18 + i;
    return {label: String(age), value: String(age)};
  });

  const [eventType, setEventType] = useState('');
  const [assocType, setAssocType] = useState('');
  const evetTypeList = [
    {label: 'Horse Riding', value: 'horseriding'},
    {label: 'Horse Riding', value: 'horseriding'},
    {label: 'Horse Riding', value: 'horseriding'},
  ];
  const associationList = [
    {label: 'Association', value: 'association'},
    {label: 'Association', value: 'association'},
    {label: 'Association', value: 'association'},
  ];

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState(false);

  return {
    isModalVisible,
    setModalVisible,
    isModalVisible1,
    setModalVisible1,
    handleSubmit,
    errors,
    reset,
    control,
    getValues,
    age,
    setAge,
    ageRange,
    eventType,
    setEventType,
    evetTypeList,
    associationList,
    assocType,
    setAssocType,
  };
};

export default EditProfileScreen;
