import {useCallback, useRef, useState} from 'react';
import {TextComponent} from '../../Components/TextComponent';

const HomeScreen = ({navigate}) => {
  const [search, setSearch] = useState('');

  const dynamicRoute = (routeName, params) => navigate(routeName, params);

  return {search, setSearch, dynamicRoute};
};

export default HomeScreen;
