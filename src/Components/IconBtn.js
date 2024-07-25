import {Image, Pressable, View} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {TextComponent} from '../../Components/TextComponent';
import {Colors} from '../../Theme/Variables';

export const IconBtn = ({icon, btnText, onpress, extraStyle, changeText}) => {
  return (
    <Pressable style={styles.listBtn} onPress={onpress}>
      <Image source={icon} style={styles.iconGreen} />
      <View style={{...styles.listInner, ...extraStyle}}>
        <TextComponent text={btnText} styles={styles.title} />
        <TextComponent
          text={changeText}
          styles={{...styles.title, color: Colors.textGrayColor}}
        />
      </View>
    </Pressable>
  );
};
