import {useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import useReduxStore from '../../Hooks/UseReduxStore';
import {onBoardingData} from '../../Utils/localDB';
import {types} from '../../Redux/types';

/**
 * The function `useOnboardingScreen` manages the onboarding screen navigation and state in a React
 * Native application.
 * @returns The function `useOnboardingScreen` returns an object with the following properties and
 * methods:
 * - `onBoardingData`: This property likely contains data related to onboarding screens.
 * - `onSnapToItem`: This method is used to handle snapping to an item in a list based on the content
 * offset.
 * - `currentIndex`: This state variable holds the current index of the onboarding screen.
 * -
 */
const useOnboardingScreen = ({navigate, params}) => {
  const {dispatch} = useReduxStore();

  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

  /**
   * The `onSnapToItem` function calculates the current index based on the content offset in a
   * horizontal scroll view.
   */
  const onSnapToItem = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(
      contentOffsetX / Dimensions.get('window').width,
    );
    setCurrentIndex(currentIndex);
  };

  /**
   * The `goNext` function checks if the current index is 2 and calls `getStart()` or scrolls to the
   * next index and updates the current index.
   */
  const goNext = () => {
    if (currentIndex == 2) getStart();
    else {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(pre => pre + 1);
    }
  };
  /**
   * The `getStart` function dispatches an action of type `onBoardFinished`.
   */
  const getStart = () => {
    dispatch({
      type: types.onBoardFinished,
    });
  };
  return {
    onBoardingData,
    onSnapToItem,
    currentIndex,
    getStart,
    goNext,
    flatListRef,
  };
};

export default useOnboardingScreen;
