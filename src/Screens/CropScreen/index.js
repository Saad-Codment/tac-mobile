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
  Animated,
  PanResponder,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewShot from 'react-native-view-shot';

const CROP_SIZE = 350;

const FILTERS = [
  {name: 'Normal', overlay: null},
  {name: 'Sepia', overlay: 'rgba(160, 120, 80, 0.3)'},
  {name: 'Grayscale', overlay: 'rgba(0, 0, 0, 0.6)'},
  {name: 'Vintage', overlay: 'rgba(180, 140, 80, 0.25)'},
  {name: 'Bright', overlay: 'rgba(255, 255, 255, 0.15)'},
  {name: 'Cool', overlay: 'rgba(100, 150, 255, 0.2)'},
  {name: 'Warm', overlay: 'rgba(255, 150, 100, 0.2)'},
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

// FULLY STABLE TEXT (NO gesture-handler, NO SVG)
const MovableText = ({item, isSelected, onSelect, onUpdate, onDelete}) => {
  const pan = useRef(
    new Animated.ValueXY({x: item.x || 100, y: item.y || 150}),
  ).current;
  const scale = useRef(new Animated.Value(item.scale || 1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({x: pan.x._value, y: pan.y._value});
    },
    onPanResponderMove: (evt, gesture) => {
      if (evt.nativeEvent.touches.length === 1) {
        pan.setValue({x: gesture.dx, y: gesture.dy});
      } else if (evt.nativeEvent.touches.length === 2) {
        const dx =
          evt.nativeEvent.touches[1].pageX - evt.nativeEvent.touches[0].pageX;
        const dy =
          evt.nativeEvent.touches[1].pageY - evt.nativeEvent.touches[0].pageY;
        const distance = Math.hypot(dx, dy);
        const newScale = Math.max(0.5, Math.min(distance / 120, 5));
        scale.setValue(newScale);
      }
    },
    onPanResponderRelease: () => {
      pan.flattenOffset();
      onUpdate({
        ...item,
        x: pan.x._value,
        y: pan.y._value,
        scale: scale._value,
      });
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        transform: [
          {translateX: pan.x},
          {translateY: pan.y},
          {scale},
          {
            rotate: rotate.interpolate({
              inputRange: [-180, 180],
              outputRange: ['-180deg', '180deg'],
            }),
          },
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
            fontSize: (item.fontSize || 36) * scale._value,
            fontWeight: 'bold',
            textShadowColor: 'black',
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
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              ×
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    setTexts(prev => [
      ...prev,
      {
        id: Date.now(),
        text: currentText,
        x: 100,
        y: 150,
        color: selectedColor,
        fontSize: 36,
        scale: 1,
        rotate: 0,
      },
    ]);
    setCurrentText('');
    setShowTextModal(false);
  };

  const updateText = updated => {
    setTexts(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const deleteText = () => {
    setTexts(prev => prev.filter(t => t.id !== selectedTextId));
    setSelectedTextId(null);
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ViewShot
          ref={cropRef}
          options={{format: 'png', quality: 1}}
          style={{
            width: CROP_SIZE,
            height: CROP_SIZE,
            borderRadius: CROP_SIZE / 2,
            overflow: 'hidden',
          }}>
          <ImageZoom
            cropWidth={CROP_SIZE}
            cropHeight={CROP_SIZE}
            imageWidth={CROP_SIZE}
            imageHeight={CROP_SIZE}
            minScale={1}
            maxScale={5}>
            <ImageBackground
              source={{uri: image.uri}}
              style={{width: CROP_SIZE, height: CROP_SIZE}}
              resizeMode="cover">
              {selectedFilter.overlay && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: selectedFilter.overlay,
                  }}
                />
              )}
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
            </ImageBackground>
          </ImageZoom>
        </ViewShot>
      </View>

      {/* FILTER BAR */}
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
                <ImageBackground
                  source={{uri: image.uri}}
                  style={{width: 70, height: 70}}>
                  {f.overlay && (
                    <View style={{flex: 1, backgroundColor: f.overlay}} />
                  )}
                </ImageBackground>
              </View>
              <Text style={{color: '#fff', marginTop: 6, fontSize: 12}}>
                {f.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* BOTTOM BAR */}
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
            <ScrollView horizontal>
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

      {/* TEXT MODAL */}
      <Modal visible={showTextModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.95)',
              justifyContent: 'flex-end',
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View
                style={{
                  backgroundColor: '#111',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <TextInput
                  placeholder="Enter text..."
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
                />
                <ScrollView horizontal style={{marginBottom: 20}}>
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
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity onPress={() => setShowTextModal(false)}>
                    <Text style={{color: '#888', padding: 14}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={addText}>
                    <Text
                      style={{
                        color: '#4CAF50',
                        padding: 14,
                        fontWeight: 'bold',
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
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
