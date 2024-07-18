import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const Colors = {
  primaryColor: 'rgba(255, 115, 0, 1)',
  black: '#000000',
  white: '#ffffff',
  themeOrg: '#FF7300',
  gray: 'rgba(45, 45, 45, 0.5)',
  grayBorder: '#D9D9D9',
  lightGray: 'rgba(0, 0, 0, 0.50)',
  textGray: 'rgba(32, 32, 32, 0.50)',
  headerBg: '#202020',
  grayFaded: 'rgba(188, 188, 188, 1)',
  themeRed: 'rgba(215, 48, 0, 1)',
};

/** FontSize **/
const FontSize = {
  scale12: Math.round(width / 36),
  scale16: Math.round(width / 27),
  scale18: Math.round(width / 24),
  scale20: Math.round(width / 21.5),
  scale24: Math.round(width / 18),
  scale32: Math.round(width / 13.5),
  small: 8,
  medium: 10,
  regular: 12,
  default: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  xxxlarge: 22,
};

const Sizes = {
  width,
  height,
  h10: Math.round(height * 0.0125),
  h20: Math.round(height * 0.025),
};

export {Colors, FontSize, Sizes};
