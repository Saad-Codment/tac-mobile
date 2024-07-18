import {Image, StyleSheet, View} from 'react-native';
import {Touchable} from './Touchable';
import {
  apple,
  appleImage,
  facebook,
  facebookImage,
  google,
  googleImage,
} from '../Assets';
import {hp, wp} from '../Config/responsive';

const SocialBottomComp = ({onSocialPress}) => {
  return (
    <View style={styles.socialView}>
      <Touchable onPress={() => onSocialPress('Google')}>
        <Image source={google} resizeMode="contain" style={styles.imageStyle} />
      </Touchable>
      <Touchable onPress={() => onSocialPress('appleID')}>
        <Image source={apple} resizeMode="contain" style={styles.imageStyle} />
      </Touchable>
      <Touchable onPress={() => onSocialPress('facebook')}>
        <Image
          source={facebook}
          resizeMode="contain"
          style={styles.imageStyle}
        />
      </Touchable>
    </View>
  );
};

export default SocialBottomComp;

const styles = StyleSheet.create({
  socialView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    // marginTop: Platform.OS == 'ios' ? hp('5') : 0,
  },

  imageStyle: {width: wp('30'), height: hp('15')},
});
