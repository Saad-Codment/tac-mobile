import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import Slider from 'rn-range-slider';

import Thumb from '../Slider/Thumb';
import Rail from '../Slider/Rail';
import Notch from '../Slider/Notch';
import {RailSelected} from '../Slider/RailSelected';
import {FontFamily, isIOS, scaleFont} from '../Theme/Variables';
import {Colors} from '../Theme/Variables';
import {hp, wp} from '../Config/responsive';

const RangeSliderComp = forwardRef(
  (
    {
      low,
      high,
      setHigh,
      setLow,
      step,
      maxRange,
      defaultLow = 0,
      defaultHigh = 100,
    },
    ref,
  ) => {
    const [resetKey, setResetKey] = useState(0);
    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);

    // ✅ Pass the value prop to Notch
    const renderNotch = useCallback(({value}) => <Notch value={value} />, []);

    const handleValueChange = useCallback((lowValue, highValue) => {
      setLow(lowValue);
      setHigh(highValue);
    }, []);

    // ✅ Make reset function accessible from parent
    useImperativeHandle(ref, () => ({
      resetSlider: () => {
        setLow(defaultLow);
        setHigh(defaultHigh);
        setResetKey(prevKey => prevKey + 1); // 🔥 Force re-render
      },
    }));

    return (
      <View style={styles.container}>
        <Slider
          key={resetKey} // 🔥 Force re-render
          style={styles.slider}
          min={0}
          max={maxRange}
          step={step || 1}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          // renderNotch={renderNotch}
          onValueChanged={handleValueChange}
        />
      </View>
    );
  },
);

export default RangeSliderComp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    height: hp(isIOS ? '4.5' : '5'),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('2'),
    backgroundColor: 'white',

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
  input: {
    width: wp('33'),
    textAlign: 'left',
    fontSize: scaleFont(14),
    fontFamily: FontFamily.regular,
    color: '#333',
  },
  toText: {
    marginHorizontal: 10,
    fontSize: scaleFont(14),
    fontFamily: FontFamily.regular,
    color: '#555',
  },
  slider: {
    width: wp('95'),
    alignSelf: 'center',
  },
});
