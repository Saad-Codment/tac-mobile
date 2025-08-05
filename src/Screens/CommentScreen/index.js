import {memo, useCallback} from 'react';
import {HeaderComponent} from '../../Components/HeaderComponent';
import useCommentScreen from './useCommentScreen';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native';
import {hp, wp} from '../../Config/responsive';
import {Colors} from '../../Theme/Variables';
import {TextComponent} from '../../Components/TextComponent';
import {Touchable} from '../../Components/Touchable';
import {keyExtractor} from '../../Utils';
import {DataNotFound} from '../../Components/DataNotFound';
import {styles} from './styles';
import {send} from '../../Assets';
import CommentComp from '../../Components/CommentComp';

const CommentScreen = ({navigation, route}) => {
  const {
    commentsList,
    dynamicRoute,
    onRefresh,
    handleAutoScroll,
    regexp,
    scrollViewRef,
    message,
    setMessage,
    sendMessage,
  } = useCommentScreen(navigation, route);

  const renderItem = useCallback(
    ({item, index}) => {
      return <CommentComp item={item} />;
    },
    [commentsList],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <HeaderComponent
        headerTitle={'Comments'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <FlatList
        data={commentsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onLayout={handleAutoScroll}
        ref={scrollViewRef}
        onContentSizeChange={handleAutoScroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <DataNotFound
            btnStyles={{width: wp('80')}}
            mainViewStyles={{marginTop: hp('25')}}
            title={'No Comments yet!'}
            subTitle={''}
          />
        }
      />
      <View
        style={{
          width: wp('100'),
          backgroundColor: 'white',
          marginTop: hp('1'),
          paddingTop: hp('1'),
        }}>
        <View
          style={{
            width: wp('85'),
            // paddingHorizontal: wp('2'),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: 'white',
          }}>
          <View style={{width: wp('70')}}>
            <TextComponent text={'Replying to test'} size={hp('1.5')} />
            <TextComponent
              text={'Replying to test'}
              fade
              size={hp('1.2')}
              numberOfLines={1}
              styles={{width: wp('70'), marginVertical: hp('0.5')}}
            />
          </View>
        </View>
        <View style={styles.searchMain}>
          <TextInput
            enablesReturnKeyAutomatically
            style={styles.searchinput}
            onChangeText={e => setMessage(e)}
            value={message}
            placeholder={'Type a message'}
            placeholderTextColor={Colors.grayFaded}
            multiline
          />

          {message != null && message != '' && regexp.test(message) && (
            <Touchable onPress={sendMessage} style={styles.sendBtnStyle}>
              <View style={styles.msgsRecieve}>
                {/* <TextComponent text={'Post'} styles={styles.sendTextStyle} /> */}
                <Image source={send} style={styles.sendIcon} />
              </View>
            </Touchable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default memo(CommentScreen);
