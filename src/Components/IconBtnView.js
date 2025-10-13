import React from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily, FontSize} from '../Theme/Variables';
import {Touchable} from './Touchable';
import {hp, wp} from '../Config/responsive';
import {arrowRightIcon, userProfileIcon} from '../Assets';
import {TextComponent} from './TextComponent';

const IconBtnView = ({
  title,
  onPress,
  leftIcon,
  viewStyle,
  textStyle,
  leftStyle,
  rightIcon,
  rightStyle,
  rightText,
  rightTextStyles,
  rightIconColor,
  leftIconColor,
  rightChilderView,
}) => {
  return (
    <Touchable
      Opacity={0.7}
      onPress={onPress}
      style={{...styles.button, ...viewStyle}}>
      {leftIcon ? (
        <Image
          source={leftIcon}
          style={{...styles.iconStyle, ...leftStyle}}
          tintColor={leftIconColor ?? Colors.primaryColor}
        />
      ) : null}
      <TextComponent text={title} styles={{...styles.text, ...textStyle}} />
      {rightChilderView ??
        (rightText ? (
          <TextComponent
            text={rightText}
            fade={true}
            styles={{
              fontSize: FontSize.scale12,
              marginRight: wp('2'),
              ...rightTextStyles,
            }}
          />
        ) : (
          <Image
            source={rightIcon}
            style={{...styles.arrowStyle, ...rightStyle}}
            tintColor={rightIconColor}
          />
        ))}
    </Touchable>
  );
};

export default IconBtnView;

const styles = StyleSheet.create({
  button: {
    // height: hp('6.5'),
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  text: {
    fontSize: FontSize.scale16,
    textAlign: 'left',
    marginLeft: wp('3'),
    flex: 1,
  },
  linearGradient: {
    borderRadius: 10,
  },
  iconStyle: {
    // flex: 0.08,
    width: wp('6'),
    height: hp('4'),
    resizeMode: 'contain',
    marginLeft: wp('2'),
    // backgroundColor: 'yellow',
  },
  arrowStyle: {
    width: wp('2'),
    height: hp('2'),
    resizeMode: 'contain',
    // backgroundColor: 'red',
    paddingRight: wp('3'),
  },
});
