import {View, Text, ScrollView, TextInput} from 'react-native';
import React, {memo} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';

const CreateEventsScreen = () => {
  const TitleInputView = ({
    title,
    onChange,
    placeHolder,
    validation,
    rightView,
    innerViewOuterStyle,
    innerExtraView,
    titleStyle,
    innerLeftView,
  }) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: hp('2.3'),
          marginBottom: hp('1'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: rightView ? 'space-between' : 'flex-start',
          }}>
          <TextComponent
            text={title}
            fade={true}
            styles={{fontSize: hp('2'), marginVertical: hp('1'), ...titleStyle}}
          />
          {rightView}
        </View>
        <View
          style={{
            width: wp('90'),
            alignSelf: 'center',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: Colors.dkBorderColor,
            backgroundColor: Colors.lightInnerColor,
            height: hp('5'),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp('2'),
            marginBottom: hp('2'),
            ...innerViewOuterStyle,
          }}>
          {innerLeftView}
          {innerExtraView}
        </View>
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <HeaderComponent headerTitle={'Create Event'} />
      <ScrollView
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}>
        <TitleInputView
          title={'Event Title'}
          innerLeftView={
            <TextInput
              style={{flex: 1, color: 'black'}}
              placeholder="Enter title"
            />
          }
          innerExtraView={
            <TextComponent text={'32/50'} styles={{fontSize: hp('1.5')}} />
          }
        />
        <TitleInputView
          innerLeftView={
            <TextInput
              style={{flex: 1, color: 'black'}}
              placeholder="Enter title"
            />
          }
          innerExtraView={
            <TextComponent text={'32/50'} styles={{fontSize: hp('1.5')}} />
          }
        />
      </ScrollView>
    </View>
  );
};

export default memo(CreateEventsScreen);
