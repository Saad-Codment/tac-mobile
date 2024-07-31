import {useCallback, useRef, useState} from 'react';
import {TextComponent} from '../../Components/TextComponent';

const HomeScreen = ({navigate}) => {
  const [search, setSearch] = useState('');
  const ref = useRef('');

  return {search, setSearch, ref};
};

export default HomeScreen;
