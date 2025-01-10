import {memo} from 'react';
import useAllSuggestedFriendsScreen from './useAllSuggestedFriendsScreen';
import {AniFlatOneByOne} from '../../AnimatedComp/AniFlatOneByOne';
import AddFriendComp from '../../Components/AddFriendComp';
import {styles} from './styles';
import {HeaderComponent} from '../../Components/HeaderComponent';
import {DataNotFound} from '../../Components/DataNotFound';
import {wp} from '../../Config/responsive';

const AllSuggestedFriendsScreen = ({navigation}) => {
  const {friendListData, onRefresh} = useAllSuggestedFriendsScreen(navigation);

  return (
    <>
      <HeaderComponent
        headerTitle={'Suggested Friends'}
        goBack={() => navigation.goBack()}
        isBack
      />
      <AniFlatOneByOne
        data={friendListData}
        flatViewStyle={styles.upComingFlatlistView}
        //   onRefresh={onRefresh}
        flatListProps={{
          numColumns: 2,
          ListEmptyComponent: (
            <DataNotFound onpress={onRefresh} btnStyles={{width: wp('80')}} />
          ),
        }}
        InnerCompnonet={(item, index) => (
          <AddFriendComp item={item} index={index} />
        )}
      />
    </>
  );
};

export default memo(AllSuggestedFriendsScreen);
