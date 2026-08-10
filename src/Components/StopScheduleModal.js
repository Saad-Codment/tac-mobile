import React, {useState, useEffect, useRef, useMemo} from 'react';
import {View, Platform, BackHandler, FlatList, StyleSheet} from 'react-native';
import {TextComponent} from './TextComponent';
import {Touchable} from './Touchable';
import ThemeButton from './ThemeButton';
import {hp, wp} from '../Config/responsive';

// ── Wheel sizing constants ──────────────────────────────────────────
const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 5;
const PAD_COUNT = Math.floor(VISIBLE_ITEMS / 2);

// ── Fully local stylesheet — this file is now self-contained. Nothing
// needs to be added to any other styles file for this component to work. ──
const S = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: wp('6'),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: wp('5'),
  },
  title: {fontSize: hp('1.8'), fontWeight: '700', color: '#111827'},
  subtitle: {fontSize: hp('1.2'), color: '#64748B', marginTop: hp('0.4')},

  row: {marginTop: hp('2')},
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {fontSize: hp('1.3'), fontWeight: '700', color: '#111827'},
  clearBtn: {paddingHorizontal: wp('2'), paddingVertical: hp('0.3')},
  clearBtnText: {fontSize: hp('1.15'), color: '#EF4444', fontWeight: '700'},
  rowFields: {flexDirection: 'row', gap: wp('2.5'), marginTop: hp('0.8')},
  fieldBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  fieldBtnActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  fieldBtnText: {fontSize: hp('1.3'), color: '#111827', fontWeight: '600'},

  actions: {flexDirection: 'row', gap: wp('3'), marginTop: hp('2.5')},
  cancelBtn: {
    flex: 1,
    height: hp('5.2'),
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelBtnText: {fontSize: hp('1.4'), color: '#1F2937', fontWeight: '600'},
  saveBtn: {flex: 1, height: hp('5.2'), borderRadius: 12},

  // ── Wheel picker ──
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1.5'),
    position: 'relative',
  },
  wheelColumn: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {fontSize: hp('1.6'), color: '#9CA3AF', fontWeight: '400'},
  wheelItemTextActive: {color: '#111827', fontWeight: '700'},
  wheelHighlight: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    marginTop: -(ITEM_HEIGHT / 2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
});

const formatDateLabel = d => {
  if (!d) return 'Set date';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTimeLabel = d => {
  if (!d) return 'Set time';
  return d.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
};

// ── Wheel primitive — pure FlatList + snapToInterval, no native module ──
const WheelColumn = ({data, selectedIndex, onChangeIndex, width}) => {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: selectedIndex * ITEM_HEIGHT,
      animated: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length]);

  const handleMomentumEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(data.length - 1, index));
    if (clamped !== selectedIndex) onChangeIndex(clamped);
  };

  const scrollToIndex = index => {
    listRef.current?.scrollToOffset({
      offset: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  return (
    <View style={[S.wheelColumn, {width}]}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{paddingVertical: ITEM_HEIGHT * PAD_COUNT}}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({item, index}) => (
          <Touchable onPress={() => scrollToIndex(index)} style={S.wheelItem}>
            <TextComponent
              text={String(item)}
              styles={[
                S.wheelItemText,
                index === selectedIndex && S.wheelItemTextActive,
              ]}
            />
          </Touchable>
        )}
      />
    </View>
  );
};

const WheelHighlight = () => (
  <View pointerEvents="none" style={S.wheelHighlight} />
);

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const daysInMonth = (year, monthIndex) =>
  new Date(year, monthIndex + 1, 0).getDate();

const DateWheelPicker = ({value, onChange}) => {
  const baseRef = useRef(value ?? new Date());
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({length: 8}, (_, i) => currentYear - 1 + i),
    [currentYear],
  );

  const [monthIndex, setMonthIndex] = useState(baseRef.current.getMonth());
  const [day, setDay] = useState(baseRef.current.getDate());
  const [year, setYear] = useState(baseRef.current.getFullYear());

  const dayCount = daysInMonth(year, monthIndex);
  const days = useMemo(
    () => Array.from({length: dayCount}, (_, i) => i + 1),
    [dayCount],
  );
  const clampedDay = Math.min(day, dayCount);

  useEffect(() => {
    const next = new Date(baseRef.current);
    next.setFullYear(year, monthIndex, clampedDay);
    onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthIndex, clampedDay, year]);

  return (
    <View style={S.wheelRow}>
      <WheelColumn
        data={MONTH_NAMES}
        selectedIndex={monthIndex}
        onChangeIndex={setMonthIndex}
        width={92}
      />
      <WheelColumn
        data={days}
        selectedIndex={clampedDay - 1}
        onChangeIndex={i => setDay(i + 1)}
        width={56}
      />
      <WheelColumn
        data={years}
        selectedIndex={years.indexOf(year)}
        onChangeIndex={i => setYear(years[i])}
        width={76}
      />
      <WheelHighlight />
    </View>
  );
};

const TimeWheelPicker = ({value, onChange}) => {
  const baseRef = useRef(value ?? new Date());
  const hours12 = useMemo(() => Array.from({length: 12}, (_, i) => i + 1), []);
  const minutes = useMemo(
    () => Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')),
    [],
  );
  const periods = ['AM', 'PM'];

  const initialHour24 = baseRef.current.getHours();
  const initialPeriodIndex = initialHour24 >= 12 ? 1 : 0;
  const initialHour12 = initialHour24 % 12 === 0 ? 12 : initialHour24 % 12;

  const [hourIndex, setHourIndex] = useState(hours12.indexOf(initialHour12));
  const [minuteIndex, setMinuteIndex] = useState(baseRef.current.getMinutes());
  const [periodIndex, setPeriodIndex] = useState(initialPeriodIndex);

  useEffect(() => {
    const hour12 = hours12[hourIndex];
    let hour24 = hour12 % 12;
    if (periodIndex === 1) hour24 += 12;
    const next = new Date(baseRef.current);
    next.setHours(hour24, minuteIndex, 0, 0);
    onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hourIndex, minuteIndex, periodIndex]);

  return (
    <View style={S.wheelRow}>
      <WheelColumn
        data={hours12}
        selectedIndex={hourIndex}
        onChangeIndex={setHourIndex}
        width={56}
      />
      <WheelColumn
        data={minutes}
        selectedIndex={minuteIndex}
        onChangeIndex={setMinuteIndex}
        width={56}
      />
      <WheelColumn
        data={periods}
        selectedIndex={periodIndex}
        onChangeIndex={setPeriodIndex}
        width={64}
      />
      <WheelHighlight />
    </View>
  );
};

const DateTimeRow = ({label, value, onChange, onClear}) => {
  const [pickerMode, setPickerMode] = useState(null); // 'date' | 'time' | null

  return (
    <View style={S.row}>
      <View style={S.rowHeader}>
        <TextComponent text={label} styles={S.rowLabel} />
        {!!value && (
          <Touchable onPress={onClear} style={S.clearBtn}>
            <TextComponent text={'Clear'} styles={S.clearBtnText} />
          </Touchable>
        )}
      </View>
      <View style={S.rowFields}>
        <Touchable
          onPress={() => setPickerMode(pickerMode === 'date' ? null : 'date')}
          style={[S.fieldBtn, pickerMode === 'date' && S.fieldBtnActive]}>
          <TextComponent
            text={formatDateLabel(value)}
            styles={S.fieldBtnText}
          />
        </Touchable>
        <Touchable
          onPress={() => setPickerMode(pickerMode === 'time' ? null : 'time')}
          style={[S.fieldBtn, pickerMode === 'time' && S.fieldBtnActive]}>
          <TextComponent
            text={formatTimeLabel(value)}
            styles={S.fieldBtnText}
          />
        </Touchable>
      </View>

      {pickerMode === 'date' && (
        <DateWheelPicker value={value} onChange={onChange} />
      )}
      {pickerMode === 'time' && (
        <TimeWheelPicker value={value} onChange={onChange} />
      )}
    </View>
  );
};

/**
 * Generic planned-time editor. Fully self-contained — no external
 * styles.js dependency, no native picker module.
 * - Departure point: showEta={false} showEtd={true}
 * - Event stop: showEta={true} showEtd={true}
 */
const StopScheduleModal = ({
  visible,
  title,
  subtitle,
  showEta = true,
  showEtd = true,
  initialEta,
  initialEtd,
  onSave,
  onClose,
}) => {
  const [eta, setEta] = useState(initialEta ?? null);
  const [etd, setEtd] = useState(initialEtd ?? null);

  useEffect(() => {
    if (visible) {
      setEta(initialEta ?? null);
      setEtd(initialEtd ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <View style={S.overlay}>
      <View style={S.card}>
        <TextComponent text={title} styles={S.title} />
        {!!subtitle && (
          <TextComponent text={subtitle} fade styles={S.subtitle} />
        )}

        {showEta && (
          <DateTimeRow
            label="📅 Planned Arrival"
            value={eta}
            onChange={setEta}
            onClear={() => setEta(null)}
          />
        )}
        {showEtd && (
          <DateTimeRow
            label="🚚 Planned Departure"
            value={etd}
            onChange={setEtd}
            onClear={() => setEtd(null)}
          />
        )}

        <View style={S.actions}>
          <ThemeButton
            title="Cancel"
            style={S.cancelBtn}
            textStyle={S.cancelBtnText}
            onPress={onClose}
          />
          <ThemeButton
            title="Save"
            isYellowTheme
            style={S.saveBtn}
            onPress={() => onSave({eta, etd})}
          />
        </View>
      </View>
    </View>
  );
};

export default StopScheduleModal;
