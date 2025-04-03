import {Platform, Pressable, StyleSheet, View} from 'react-native';
import {TextComponent} from './TextComponent';
import {hp, wp} from '../Config/responsive';
import {CircleImage} from './CircleImage';
import ThemeButton from './ThemeButton';
import {Colors} from '../Theme/Variables';
import moment from 'moment';
import {convertToCustomTimeFormat} from '../Services/GlobalFunctions';
import useReduxStore from '../Hooks/UseReduxStore';
import {types} from '../Redux/types';
import {imageUrl} from '../Utils/Urls';

const NotificationComp = ({item, index, acceptReq, declineReq}) => {
  console.log('itemitemitemitem', item);
  const {dispatch} = useReduxStore();

  const onImagePress = () => {
    dispatch({
      payload: item?.profile_image,
      type: types.openModal,
    });
  };

  const notificationsType = {
    1: data => {
      return (
        <View style={styles.reqMainView}>
          <Pressable>
            <CircleImage image={null} uri={true} size={0.15} />
          </Pressable>
          <View style={{marginLeft: wp('2')}}>
            <View style={styles.reqTitleView}>
              <TextComponent
                text={'Jess Lockwood'}
                styles={{width: wp('64'), fontWeight: 'bold'}}
              />
              <TextComponent
                text={convertToCustomTimeFormat(data?.created_at)}
                styles={styles.reqTimeText}
              />
            </View>
            <TextComponent text={data?.body} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: hp('1.5'),
                width: wp('70'),
              }}>
              <ThemeButton
                title={'Accept'}
                style={styles.acceptBtn}
                textStyle={{
                  color: 'white',
                  fontSize: hp('1.5'),
                }}
                onPress={() => {
                  //   onAcceptReq(item?.id);
                }}
              />
              <ThemeButton
                title={'Remove'}
                style={styles.rejectBtn}
                textStyle={{
                  fontSize: hp('1.5'),
                  color: 'black',
                }}
                onPress={() => {
                  //   onCancelReq(item?.id);
                }}
              />
            </View>
          </View>
        </View>
      );
    },
  };

  return (
    <View style={styles.reqMainView}>
      <Pressable onPress={onImagePress}>
        <CircleImage
          image={imageUrl(item?.profile_image)}
          uri={true}
          size={0.15}
        />
      </Pressable>
      <View style={{marginLeft: wp('2')}}>
        <View style={styles.reqTitleView}>
          <TextComponent
            text={'Jess Lockwood'}
            styles={{width: wp('64'), fontWeight: 'bold'}}
          />
          <TextComponent
            text={convertToCustomTimeFormat(item?.created_at)}
            styles={styles.reqTimeText}
          />
        </View>
        <TextComponent
          text={item?.body}
          styles={{fontSize: hp('1.5'), width: wp('75'), marginTop: hp('0.5')}}
        />
        {item?.notification_type_id == 1 && (
          <View style={styles.btnView}>
            <ThemeButton
              title={'Accept'}
              style={styles.acceptBtn}
              textStyle={{
                color: 'white',
                fontSize: hp('1.5'),
              }}
              onPress={() => {
                acceptReq(item?.id);
              }}
            />
            <ThemeButton
              title={'Remove'}
              style={styles.rejectBtn}
              textStyle={{
                fontSize: hp('1.5'),
                color: 'black',
              }}
              onPress={() => {
                declineReq(item?.id);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationComp;

const styles = StyleSheet.create({
  reqMainView: {
    width: wp('100'),
    paddingHorizontal: wp('3'),
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  reqTitleView: {flexDirection: 'row', alignItems: 'center'},
  reqTimeText: {
    fontSize: hp('1.7'),
    marginLeft: Platform.OS == 'ios' ? 0 : wp('1'),
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('1.5'),
    width: wp('70'),
  },
  acceptBtn: {
    backgroundColor: Colors.primaryColor,
    height: hp('4'),
    width: wp('30'),
  },
  rejectBtn: {
    backgroundColor: Colors.diableBtnCOlor,
    height: hp('4'),
    width: wp('30'),
  },
});
