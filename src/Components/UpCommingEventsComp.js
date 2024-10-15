import {View} from 'react-native';
import {hp, wp} from '../Config/responsive';
import BlurImage from './BlurImage';
import {CircleImage} from './CircleImage';

const UpcomingEventsComp = () => {
  return (
    <View
      style={{
        width: wp('80'),
        height: hp('30'),
        backgroundColor: 'red',
        borderRadius: 20,
        overflow: 'hidden',
      }}>
      <BlurImage styles={{width: wp('80'), height: hp('13')}} />
      <View style={{width: wp('70'), alignSelf: 'center'}}>
        <CircleImage
          image={
            'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }
          uri={true}
          styles={{borderRadius: 5, width: wp('12'), height: hp('5')}}
          radius={5}
        />
      </View>
    </View>
  );
};

export default UpcomingEventsComp;
