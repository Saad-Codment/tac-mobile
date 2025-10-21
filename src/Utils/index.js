import {useNavigation} from '@react-navigation/native';

const {goBack} = useNavigation();

const keyExtractor = (item, index) => item?.id?.toString() || index?.toString();

export {keyExtractor, goBack};
