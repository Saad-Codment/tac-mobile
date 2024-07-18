import {useNavigation} from '@react-navigation/native';

const {goBack} = useNavigation();

const keyExtractor = item => item?.id;

export {keyExtractor, goBack};
