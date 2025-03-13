import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const KeyBoardWrapper = ({children, scroll, styles, bounces}) => (
  <KeyboardAwareScrollView
    showsVerticalScrollIndicator={false}
    bounces={bounces ?? true}
    scrollEnabled={scroll ?? true}
    // keyboardShouldPersistTaps={'always'}
    contentContainerStyle={{flexGrow: 1, ...styles}}>
    {children}
  </KeyboardAwareScrollView>
);

export default KeyBoardWrapper;
