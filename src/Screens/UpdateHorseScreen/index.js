import {View, Text, Image} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {bigHorseNail} from '../../Assets';
import {hp, wp} from '../../Config/responsive';
import {TextComponent} from '../../Components/TextComponent';
import useUpdateHorseScreen from './useUpdateHorseScreen';
import {MultiSelectButton} from '../../Components/MultiSelectButton';
import ThemeButton from '../../Components/ThemeButton';

const UpdateHorseScreen = () => {
  const {
    allTransportData,
    refetchAllTransportData,
    selectedVal,
    setSelectedVal,
    updateTransport,
  } = useUpdateHorseScreen();
  return (
    <View style={{flex: 1}}>
      <HeaderComponent headerTitle={'Edit info'} isBack />
      <Image
        source={bigHorseNail}
        resizeMode="contain"
        style={{
          width: wp('40'),
          height: hp('20'),
          alignSelf: 'center',
          marginTop: hp('5'),
        }}
      />
      <TextComponent
        text={'Are you willing to\nhave horses for others?'}
        size={hp('2.5')}
        fontFamily={'bold'}
        styles={{marginLeft: wp('5'), marginVertical: hp('3')}}
      />
      <View style={{marginHorizontal: wp('5'), flex: 1}}>
        <MultiSelectButton
          items={allTransportData}
          selectedAlter={selectedVal}
          onSelectVal={(_, e) => setSelectedVal(e)}
          selectedBgColor={'black'}
        />
        <ThemeButton
          title={'Save'}
          style={{
            height: hp('5'),
            borderRadius: hp('2.5'),
            width: wp('88'),
            marginTop: hp('8'),
          }}
          isYellowTheme
          textStyle={{fontSize: hp('1.5')}}
          onPress={updateTransport}
        />
      </View>
    </View>
  );
};

export default memo(UpdateHorseScreen);
