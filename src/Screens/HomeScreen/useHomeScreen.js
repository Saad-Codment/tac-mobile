import {useCallback, useState} from 'react';
import {TextComponent} from '../../Components/TextComponent';

const HomeScreen = ({navigate}) => {
  const {search, setSearch} = useState('');

  return {search, setSearch};
};

export default HomeScreen;
