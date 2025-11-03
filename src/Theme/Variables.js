import {Dimensions, PixelRatio, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');

const Colors = {
  primaryColor: 'rgba(203, 149, 49, 1)',
  secondryColor: 'rgba(255, 238, 207, 1)',
  thridColor: 'rgba(203, 149, 49, 0.15)',
  black: '#000000',
  white: '#ffffff',
  gray: 'rgba(45, 45, 45, 0.5)',
  grayBorder: '#D9D9D9',
  textGray: '  rgba(150, 150, 150, 1)',
  headerBg: '#202020',
  grayFaded: 'rgba(188, 188, 188, 1)',
  themeRed: 'rgba(215, 48, 0, 1)',
  backgroundTheme: 'rgba(24, 24, 24, 1)',
  lightGray: 'rgba(0, 0, 0, 0.1)',
  yellowBgColor: 'rgba(255, 238, 207, 1)',
  lightYellowBgColor: 'rgba(255, 238, 207, 0.4)',
  yellowTextColor: 'rgba(137, 119, 86, 1)',
  dkBorderColor: 'rgba(192, 192, 192, 1)',
  lightInnerColor: 'rgba(246, 246, 246, 1)',
  darkThemeTextColor: 'rgba(24, 24, 24, 1)',
  lightBlueTextColor: 'rgba(24, 119, 242, 1)',
  diableBtnCOlor: 'rgba(238, 238, 238, 1)',
  bgGray: 'rgba(245, 245, 245, 1)',
};
const isIOS = Boolean(Platform.OS == 'ios');

/** FontSize **/
const FontSize = {
  scale12: Math.round(width / 36),
  scale13: Math.round(width / 33),
  scale14: Math.round(width / 31.5),
  scale15: Math.round(width / 29),
  scale16: Math.round(width / 27),
  scale17: Math.round(width / 26.5),
  scale18: Math.round(width / 24),
  scale19: Math.round(width / 22),
  scale20: Math.round(width / 21.5),
  scale21: Math.round(width / 20),
  scale22: Math.round(width / 19.5),
  scale23: Math.round(width / 19),
  scale24: Math.round(width / 18),
  scale25: Math.round(width / 17.5),
  scale26: Math.round(width / 16.5),
  scale27: Math.round(width / 16),
  scale28: Math.round(width / 15.5),
  scale29: Math.round(width / 15),
  scale30: Math.round(width / 14.5),
  scale31: Math.round(width / 14),
  scale32: Math.round(width / 13.5),
  scale33: Math.round(width / 13),
  scale34: Math.round(width / 12.5),
  scale35: Math.round(width / 12),
  scale36: Math.round(width / 11.5),
  scale37: Math.round(width / 11),
  scale38: Math.round(width / 10.5),
  scale39: Math.round(width / 10),
  scale40: Math.round(width / 9.5),
  scale41: Math.round(width / 9),
  scale42: Math.round(width / 8.5),
  scale43: Math.round(width / 8),
  scale44: Math.round(width / 7.5),
  scale45: Math.round(width / 7),
  scale46: Math.round(width / 6.5),
  scale47: Math.round(width / 6),
  scale48: Math.round(width / 5.5),
  scale49: Math.round(width / 5),
  scale50: Math.round(width / 4.5),
};
const Sizes = {
  width,
  height,
  h10: Math.round(height * 0.0125),
  h20: Math.round(height * 0.025),
};
// Function to scale font size based on the detected base width
const scaleFont = size => (size * width) / BASE_WIDTH;

// Function to determine the base width dynamically
const dpr = PixelRatio.get();
const getBaseWidth = () => {
  // Check for specific iPhone models using width, height, and device pixel ratio:
  console.log({Platform});

  if (width === 393 && height === 852 && dpr === 3) {
    // iPhone 15 and iPhone 15 Pro (also iPhone 14 Pro with same dimensions)
    return 393;
  }
  if (width === 430 && height === 932 && dpr === 3) {
    // iPhone 15 Plus and iPhone 15 Pro Max (also iPhone 14 Pro Max)
    return 430;
  }
  if (width === 390 && height === 844 && dpr === 3) {
    // iPhone 14 (also iPhone 12, 12 Pro, 13, 13 Pro, 14)
    return 390;
  }
  if (width === 428 && height === 926 && dpr === 3) {
    // iPhone 14 Plus (also iPhone 12 Pro Max, 13 Pro Max, 14 Plus)
    return 428;
  }
  if (width === 375 && height === 812 && dpr === 3) {
    // iPhone 13 Mini (also iPhone X, Xs, 11 Pro, 12 Mini)
    return 375;
  }
  if (width === 414 && height === 896 && dpr === 2) {
    // iPhone 11 / iPhone XR
    return 414;
  }
  if (width === 414 && height === 896 && dpr === 3) {
    // iPhone 11 Pro Max (also iPhone Xs Max, iPhone 11 Pro Max)
    return 414;
  }
  if (width === 375 && height === 667 && dpr === 2) {
    // iPhone SE (1st to 3rd gen, iPhone 7, 8)
    return 375;
  }

  // Fallback for other devices:
  if (width <= 320) return 320; // Small Android devices (e.g., old phones)
  if (width <= 360) return 360; // Common Android devices (Samsung A-series, Moto G)
  if (width <= 375) return 375; // Standard width for many phones
  if (width <= 414) return 414; // Larger phones
  if (width <= 480) return 480; // Small tablets (e.g., iPad Mini)
  if (width <= 600) return 600; // Mid-sized tablets (e.g., Amazon Fire HD)
  if (width <= 768) return 768; // Standard tablets (e.g., iPad 9th/10th Gen)
  if (width <= 1024) return 1024; // Large tablets (e.g., iPad Pro)
  return 1280; // Extra-large screens (Desktop-like, foldable devices, large tablets)
};

const BASE_WIDTH = getBaseWidth();

const FontFamily = {
  regular: 'ProximaNova-Regular',
  semiBold: 'ProximaNova-Semibold',
  bold: 'ProximaNova-Bold',
};

export {Colors, FontSize, Sizes, isIOS, scaleFont, BASE_WIDTH, FontFamily};
