import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUiStore } from '../../../lib/store';

const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

export default function PieChartMonthSheet({
  isVisible,
  onClose,
  onSelect,
  value,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (monthIndex: number, year: number) => void; // monthIndex: 0-11
  value: { monthIndex: number; year: number };
}) {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);
  const [year, setYear] = useState(value.year);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const { theme } = useUiStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isVisible) ref.current?.present();
    else ref.current?.dismiss();
  }, [isVisible]);

  useEffect(() => {
    setYear(value.year);
  }, [value.year]);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" opacity={0.4} />
      )}
      backgroundStyle={{
        backgroundColor: isDark ? '#111827' : '#f8fafc',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#6b7280' : '#cbd5f5',
        width: 36,
        height: 4,
        borderRadius: 999,
      }}
    >
      <BottomSheetView className="flex-1 px-6">
        <View className="mb-5 flex-row items-center justify-between pt-1">
          <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">เลือกเดือนและปี</Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2" onPress={() => setYear((y) => y - 1)}>
              <Text className="text-gray-700 dark:text-gray-300">‹</Text>
            </TouchableOpacity>
            <View className="rounded-lg bg-white dark:bg-gray-900 px-3 py-2">
              <Text className="text-sm text-gray-900 dark:text-gray-100">{year}</Text>
            </View>
            <TouchableOpacity
              className={`ml-2 rounded-lg px-3 py-2 ${year >= currentYear ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}
              disabled={year >= currentYear}
              onPress={() => setYear((y) => Math.min(currentYear, y + 1))}
            >
              <Text className={`$${year >= currentYear ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`.replace('$$', '')}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row flex-wrap -mx-1">
          {months.map((m, i) => {
            const isActive = i === value.monthIndex && year === value.year;
            const isDisabled = year === currentYear && i > currentMonthIndex;
            return (
              <View key={i} style={{ width: '25%', paddingHorizontal: 4, marginBottom: 8 }}>
                <TouchableOpacity
                  disabled={isDisabled}
                  onPress={() => onSelect(i, year)}
                  className={`items-center rounded-xl border px-3 py-3 ${isActive ? 'border-blue-300 bg-blue-50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'} ${isDisabled ? 'opacity-50' : ''}`}
                  activeOpacity={0.8}
                >
                  <Text className={`text-sm ${isActive ? 'text-blue-700' : isDisabled ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>{m}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

