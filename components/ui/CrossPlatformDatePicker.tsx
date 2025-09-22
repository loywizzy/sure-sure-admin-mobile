import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, View, Modal, TouchableOpacity } from 'react-native';

interface CrossPlatformDatePickerProps {
  isVisible: boolean;
  date: Date | null;
  mode?: 'date' | 'time' | 'datetime';
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onClear?: () => void;
}

const CrossPlatformDatePicker: React.FC<CrossPlatformDatePickerProps> = ({
  isVisible,
  date,
  mode = 'date',
  onConfirm,
  onCancel,
  title,
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
  minimumDate,
  maximumDate,
  onClear,
}) => {
  const [tempDate, setTempDate] = useState<Date>(date ?? new Date());
  const isWeb = Platform.OS === 'web';
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      setTempDate(date ?? new Date());
    }
  }, [date, isVisible]);

  // auto open native date input on web
  useEffect(() => {
    if (isWeb && isVisible) {
      inputRef.current?.showPicker?.();
      inputRef.current?.focus();
    }
  }, [isWeb, isVisible]);

  const formatDateForInput = useMemo(
    () =>
      (value: Date) => {
        return value.toISOString().split('T')[0];
      },
    []
  );

  if (isWeb) {
    if (!isVisible) return null;

    return (
      <input
        ref={inputRef}
        type="date"
        value={formatDateForInput(tempDate)}
        min={minimumDate ? formatDateForInput(minimumDate) : undefined}
        max={maximumDate ? formatDateForInput(maximumDate) : undefined}
        onChange={(event) => {
          const newDate = new Date(event.target.value);
          setTempDate(newDate);
          onConfirm(newDate);
        }}
        onBlur={onCancel}
        style={{ position: 'fixed', inset: 0, opacity: 0, zIndex: 2147483647 }}
      />
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DateTimePicker = require('@react-native-community/datetimepicker').default;

    if (!isVisible) return null;

    // Android: ใช้ dialog ของระบบ (ไม่ต้องมี Modal/หัวข้อเพิ่มเติม)
    if (Platform.OS === 'android') {
      return (
        <DateTimePicker
          value={tempDate}
          mode={mode}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          display="calendar"
          onChange={(event: any, selectedDate?: Date) => {
            if (event.type === 'set' && selectedDate) {
              onConfirm(selectedDate);
            }
            onCancel();
          }}
        />
      );
    }

    // iOS: แสดงแบบ modal โปร่งใสเฉพาะตัว picker (ไม่มี header/ปุ่มซ้ำ)
    return (
      <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={1}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)' }}
        />
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={(event: any, selectedDate?: Date) => {
              if (selectedDate) {
                onConfirm(selectedDate);
              }
            }}
          />
        </View>
      </Modal>
    );
  } catch (error) {
    console.warn('DateTimePicker not available:', error);
    return null;
  }
};

export default CrossPlatformDatePicker;
