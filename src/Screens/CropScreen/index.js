import React, {memo, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot from 'react-native-view-shot';
import Svg, {
  Defs,
  Filter,
  FeColorMatrix,
  Image as SvgImage,
} from 'react-native-svg';
import {
  PinchGestureHandler,
  RotationGestureHandler,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {hp} from '../../Config/responsive';

const CROP_SIZE = 400;

const FILTERS = [
  {name: 'Normal', type: 'none'},
  {name: 'Sepia', type: 'sepia'},
  {name: 'Grayscale', type: 'grayscale'},
  {name: 'Vintage', type: 'vintage'},
  {name: 'Bright', type: 'bright'},
  {name: 'Cool', type: 'cool'},
  {name: 'Warm', type: 'warm'},
];

const TEXT_COLORS = [
  '#FFFFFF',
  '#FFEB3B',
  '#FF5722',
  '#4CAF50',
  '#2196F3',
  '#E91E63',
  '#000000',
  '#FF9800',
];

function MovableText({item, isSelected, onSelect, onUpdate, onDelete}) {
  const [position, setPosition] = useState({
    x: item.x || 100,
    y: item.y || 150,
  });
  const [scale, setScale] = useState(item.scale || 1);
  const [rotate, setRotate] = useState(item.rotate || 0);

  const lastOffset = useRef({x: position.x, y: position.y});
  const lastScale = useRef(scale);
  const lastRotate = useRef(rotate);

  const onPanGestureEvent = event => {
    event.persist();
    if (event.nativeEvent.state === State.ACTIVE) {
      const tx = event.nativeEvent.translationX || 0;
      const ty = event.nativeEvent.translationY || 0;
      setPosition({
        x: lastOffset.current.x + tx,
        y: lastOffset.current.y + ty,
      });
    }
  };

  const onPanHandlerStateChange = event => {
    event.persist();
    if (event.nativeEvent.state === State.END) {
      lastOffset.current = position;
      onUpdate({...item, x: position.x, y: position.y, scale, rotate});
    }
  };

  const onPinchGestureEvent = event => {
    event.persist();
    if (event.nativeEvent.state === State.ACTIVE) {
      const newScale = lastScale.current * (event.nativeEvent.scale || 1);
      setScale(Math.max(0.5, Math.min(newScale, 4)));
    }
  };

  const onPinchHandlerStateChange = event => {
    event.persist();
    if (event.nativeEvent.state === State.END) {
      lastScale.current = scale;
      onUpdate({...item, x: position.x, y: position.y, scale, rotate});
    }
  };

  const onRotateGestureEvent = event => {
    event.persist();
    if (event.nativeEvent.state === State.ACTIVE) {
      setRotate(lastRotate.current + (event.nativeEvent.rotation || 0));
    }
  };

  const onRotateHandlerStateChange = event => {
    event.persist();
    if (event.nativeEvent.state === State.END) {
      lastRotate.current = rotate;
      onUpdate({...item, x: position.x, y: position.y, scale, rotate});
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
      minPointers={1}>
      <View style={{position: 'absolute'}}>
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}>
          <View>
            <RotationGestureHandler
              onGestureEvent={onRotateGestureEvent}
              onHandlerStateChange={onRotateHandlerStateChange}>
              <View
                style={{
                  transform: [
                    {translateX: position.x},
                    {translateY: position.y},
                    {scale},
                    {rotate: `${rotate}rad`},
                  ],
                }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => onSelect(item.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 14,
                    borderWidth: isSelected ? 3 : 0,
                    borderColor: '#4CAF50',
                  }}>
                  <Text
                    style={{
                      color: item.color || '#FFFFFF',
                      fontSize: (item.fontSize || 36) * scale,
                      fontWeight: 'bold',
                      textShadowColor: 'rgba(0,0,0,0.9)',
                      textShadowOffset: {width: 2, height: 2},
                      textShadowRadius: 8,
                    }}>
                    {item.text}
                  </Text>
                  {isSelected && (
                    <TouchableOpacity
                      onPress={onDelete}
                      style={{
                        position: 'absolute',
                        top: -14,
                        right: -14,
                        backgroundColor: '#F44336',
                        borderRadius: 16,
                        width: 32,
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        ×
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            </RotationGestureHandler>
          </View>
        </PinchGestureHandler>
      </View>
    </PanGestureHandler>
  );
}

function CropScreen({route, navigation}) {
  const {image} = route.params;
  const cropRef = useRef();
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  const addText = () => {
    if (!currentText.trim()) return;
    const newText = {
      id: Date.now(),
      text: currentText,
      x: 100,
      y: 150,
      color: selectedColor,
      fontSize: 36,
      scale: 1,
      rotate: 0,
    };
    setTexts(prev => [...prev, newText]);
    setCurrentText('');
    setShowTextModal(false);
  };

  const updateText = updated => {
    setTexts(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const deleteText = () => {
    if (selectedTextId !== null) {
      setTexts(prev => prev.filter(t => t.id !== selectedTextId));
      setSelectedTextId(null);
    }
  };

  const handleConfirm = async () => {
    try {
      const uri = await cropRef.current.capture();
      route.params.afterCropImg(uri);
      navigation.goBack();
    } catch (e) {
      console.log('Capture error:', e);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {/* Crop Area */}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ViewShot
          ref={cropRef}
          options={{format: 'png', quality: 1}}
          style={{
            width: CROP_SIZE,
            height: CROP_SIZE,
            borderRadius: CROP_SIZE / 2,
            overflow: 'hidden',
            backgroundColor: '#000',
          }}>
          <ImageZoom
            cropWidth={CROP_SIZE}
            cropHeight={CROP_SIZE}
            imageWidth={CROP_SIZE}
            imageHeight={CROP_SIZE}
            minScale={1}
            maxScale={5}>
            <Svg width={CROP_SIZE} height={CROP_SIZE}>
              <Defs>
                {selectedFilter.type !== 'none' && (
                  <Filter id="filter">
                    {selectedFilter.type === 'sepia' && (
                      <FeColorMatrix values="0.393 0.769 0.189 0 0   0.349 0.686 0.168 0 0   0.272 0.534 0.131 0 0   0 0 0 1 0" />
                    )}
                    {selectedFilter.type === 'grayscale' && (
                      <FeColorMatrix type="saturate" values="0.22" />
                    )}
                    {selectedFilter.type === 'vintage' && (
                      <FeColorMatrix values="1.1 0.1 0   0 0   0.1 1.0 0.1 0 0   0   0.1 1.1 0 0   0 0 0 1 0" />
                    )}
                    {selectedFilter.type === 'bright' && (
                      <FeColorMatrix values="1.4 0 0 0 0.1   0 1.4 0 0 0.1   0 0 1.4 0 0.1   0 0 0 1 0" />
                    )}
                    {selectedFilter.type === 'cool' && (
                      <FeColorMatrix values="1 0 0 0 0.05   0 1 0.1 0 0.05   0 0.1 1.1 0 0.05   0 0 0 1 0" />
                    )}
                    {selectedFilter.type === 'warm' && (
                      <FeColorMatrix values="1.2 0 0 0 0.1   0 1.1 0 0 0.05   0 0 1 0 0   0 0 0 1 0" />
                    )}
                  </Filter>
                )}
              </Defs>
              <SvgImage
                href={{uri: image.uri}}
                width={CROP_SIZE}
                height={CROP_SIZE}
                preserveAspectRatio="xMidYMid slice"
                filter={
                  selectedFilter.type !== 'none' ? 'url(#filter)' : undefined
                }
              />
            </Svg>

            {texts.map(txt => (
              <MovableText
                key={txt.id}
                item={txt}
                isSelected={selectedTextId === txt.id}
                onSelect={setSelectedTextId}
                onUpdate={updateText}
                onDelete={deleteText}
              />
            ))}
          </ImageZoom>
        </ViewShot>
      </View>

      {/* Filter Bar */}
      <View style={{height: 100, backgroundColor: '#111'}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{padding: 10}}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.name}
              onPress={() => setSelectedFilter(f)}
              style={{alignItems: 'center', marginHorizontal: 10}}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  overflow: 'hidden',
                  borderWidth: selectedFilter.name === f.name ? 4 : 2,
                  borderColor:
                    selectedFilter.name === f.name ? '#4CAF50' : '#555',
                }}>
                <Image
                  source={{uri: image.uri}}
                  style={{width: 70, height: 70}}
                  resizeMode="cover"
                />
              </View>
              <Text style={{color: '#fff', marginTop: 6, fontSize: 12}}>
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Toolbar */}
      <View
        style={{
          padding: 15,
          backgroundColor: '#000',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => setShowTextModal(true)} style={btn}>
          <Text style={btnTxt}>Add Text</Text>
        </TouchableOpacity>

        {selectedTextId !== null && (
          <>
            <TouchableOpacity
              onPress={deleteText}
              style={{...btn, backgroundColor: '#D32F2F'}}>
              <Text style={btnTxt}>Delete</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TEXT_COLORS.map(col => (
                <TouchableOpacity
                  key={col}
                  onPress={() =>
                    setTexts(prev =>
                      prev.map(t =>
                        t.id === selectedTextId ? {...t, color: col} : t,
                      ),
                    )
                  }
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: col,
                    marginHorizontal: 6,
                    borderWidth: 3,
                    borderColor: '#fff',
                  }}
                />
              ))}
            </ScrollView>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()} style={btnCancel}>
          <Text style={btnTxt}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm} style={btnConfirm}>
          <Text style={btnTxt}>Confirm</Text>
        </TouchableOpacity>
      </View>

      {/* FIXED KEYBOARD MODAL */}
      <Modal visible={showTextModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.95)',
              justifyContent: 'flex-end',
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              style={{width: '100%'}}>
              <View
                style={{
                  backgroundColor: '#111',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  maxHeight: hp('70'),
                }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <TextInput
                    placeholder="Enter your text..."
                    placeholderTextColor="#888"
                    value={currentText}
                    onChangeText={setCurrentText}
                    style={{
                      backgroundColor: '#222',
                      color: '#fff',
                      padding: 18,
                      borderRadius: 14,
                      fontSize: 22,
                      marginBottom: 20,
                    }}
                    autoFocus
                    returnKeyType="done"
                  />

                  <Text style={{color: '#aaa', marginBottom: 12, fontSize: 16}}>
                    Choose Color:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                      marginBottom: 25,
                    }}>
                    {TEXT_COLORS.map(col => (
                      <TouchableOpacity
                        key={col}
                        onPress={() => setSelectedColor(col)}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          backgroundColor: col,
                          marginHorizontal: 10,
                          borderWidth: selectedColor === col ? 5 : 3,
                          borderColor: '#fff',
                        }}
                      />
                    ))}
                  </ScrollView>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        setShowTextModal(false);
                      }}>
                      <Text style={{color: '#888', padding: 14, fontSize: 16}}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        addText();
                        Keyboard.dismiss();
                      }}>
                      <Text
                        style={{
                          color: '#4CAF50',
                          padding: 14,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Add Text
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const btn = {
  paddingHorizontal: 22,
  paddingVertical: 14,
  backgroundColor: '#333',
  borderRadius: 30,
};
const btnCancel = {...btn, backgroundColor: '#666'};
const btnConfirm = {...btn, backgroundColor: '#4CAF50'};
const btnTxt = {color: '#fff', fontWeight: '600', fontSize: 16};

export default memo(CropScreen);
