import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import React, {memo, useState} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {TextComponent} from '../../Components/TextComponent';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {Touchable} from '../../Components/Touchable';
import {
  addcircle,
  gpsImg,
  radioCircle,
  radioCircleOn,
  tickSquare,
  uploadImgView,
} from '../../Assets';
import DatePicker from 'react-native-date-picker';
import DividerLine from '../../Components/DividerLine';
import ErrorInputComponent from '../../Components/ErrorInputComponent';
import {Dropdown} from 'react-native-element-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import ThemeButton from '../../Components/ThemeButton';
import {styles} from './styles';
import useCreateEventsScreen from './useCreateEventsScreen';

const CreateEventsScreen = ({navigation}) => {
  const {currentDate, dynamicRoute} = useCreateEventsScreen(navigation);

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
    centerInnerView,
  }) => {
    return (
      <View style={styles.mainView}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: rightView ? 'space-between' : 'flex-start',
          }}>
          <TextComponent
            text={title}
            fade={true}
            styles={{
              ...styles.compTitle,
              ...titleStyle,
            }}
          />
          {rightView}
        </View>
        {centerInnerView ? (
          centerInnerView
        ) : (
          <View
            style={{
              ...styles.innerView,
              ...innerViewOuterStyle,
            }}>
            {innerLeftView}
            {innerExtraView}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flexGrow: 1}}>
      <DatePicker modal date={currentDate} open={false} />
      <HeaderComponent headerTitle={'Create Event'} />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <TitleInputView
          title={'Event Title'}
          innerLeftView={
            <TextInput style={styles.inputStyle} placeholder="Enter title" />
          }
          innerExtraView={
            <TextComponent text={'32/50'} styles={{fontSize: hp('1.5')}} />
          }
        />
        <TitleInputView
          title={'Event Image'}
          centerInnerView={
            <Touchable>
              <Image
                source={uploadImgView}
                resizeMode="contain"
                style={styles.uploadImg}
              />
            </Touchable>
          }
        />
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Start Date'}
            innerLeftView={
              <TextComponent
                text={'12 - July - 2024'}
                styles={styles.textStyle}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Start Time'}
            innerLeftView={
              <TextComponent text={'08 : 00 Pm'} styles={styles.textStyle} />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'End Date'}
            innerLeftView={
              <TextComponent
                text={'12 - July - 2024'}
                styles={styles.textStyle}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'End Time'}
            innerLeftView={
              <TextComponent text={'08 : 00 Pm'} styles={styles.textStyle} />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Event Location'}
          innerLeftView={
            <TextComponent
              text={'Empire Batteries, Incorporation.'}
              styles={styles.textStyle}
            />
          }
          innerExtraView={
            <Image
              source={gpsImg}
              resizeMode="contain"
              style={styles.leftViewImg}
            />
          }
        />
        <TitleInputView
          title={'Performances'}
          innerLeftView={
            <View>
              <TextComponent
                text={'2nd Performance: Team Roping'}
                styles={styles.textStyle}
              />
              <DividerLine DividerLineStyle={styles.divider} />
              <View style={styles.perInnerView}>
                <TextComponent
                  text={'12 - July - 2024'}
                  styles={styles.perInnerText}
                />
                <TextComponent
                  text={'08 : 00 - 11 : 00 Pm'}
                  styles={styles.perInnerText}
                />
              </View>
            </View>
          }
          innerViewOuterStyle={styles.perInnerOuterView}
          rightView={
            <Touchable style={styles.addMoreView}>
              <Image
                source={addcircle}
                resizeMode="contain"
                style={styles.addMoreImg}
              />
              <TextComponent
                text={'Add more'}
                fade={true}
                styles={styles.addMoreTxt}
              />
            </Touchable>
          }
        />
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Event type'}
            innerLeftView={
              <TextComponent text={'Barrel Racing'} styles={styles.textStyle} />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'Private event'}
            innerLeftView={
              <DropDownPicker
                // open={open}
                // value={value}
                items={[1, 2, 3, 3]}
                // setOpen={setOpen}
                // setValue={setValue}
                // setItems={setItems}
                style={{backgroundColor: 'transaprent', borderWidth: 0}}
                placeholder={'Yes'}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Association'}
          innerLeftView={
            <TextComponent
              text={'Empire Batteries'}
              styles={styles.textStyle}
            />
          }
          innerExtraView={
            <Image
              source={gpsImg}
              resizeMode="contain"
              style={styles.leftViewImg}
            />
          }
        />
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Circuits'}
            innerLeftView={
              <TextComponent text={'Green Mile'} styles={styles.textStyle} />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            title={'tour'}
            innerLeftView={
              <DropDownPicker
                // open={open}
                // value={value}
                items={[1, 2, 3, 3]}
                // setOpen={setOpen}
                // setValue={setValue}
                // setItems={setItems}
                style={{backgroundColor: 'transaprent', borderWidth: 0}}
                placeholder={'No'}
              />
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <View style={styles.viewFlex}>
          <TitleInputView
            title={'Event Confirmation'}
            innerLeftView={
              <>
                <TextComponent text={'Planning'} styles={styles.textStyle} />
                <Image
                  source={radioCircleOn}
                  resizeMode="contain"
                  style={styles.leftViewImg}
                />
              </>
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
          <TitleInputView
            innerLeftView={
              <>
                <TextComponent text={'Confirmed'} styles={styles.textStyle} />
                <Image
                  source={radioCircle}
                  resizeMode="contain"
                  style={styles.leftViewImg}
                />
              </>
            }
            innerViewOuterStyle={{width: wp('40')}}
          />
        </View>
        <TitleInputView
          title={'Event Confirmation'}
          innerLeftView={
            <TextComponent
              text={'Empire Batteries, Incorporation.'}
              styles={styles.textStyle}
            />
          }
          innerExtraView={
            <Image
              source={tickSquare}
              resizeMode="contain"
              style={styles.leftViewImg}
            />
          }
        />
        <ThemeButton
          title={'Create Event'}
          isYellowTheme
          style={styles.createBtnStyle}
        />
      </ScrollView>
    </View>
  );
};

export default memo(CreateEventsScreen);
