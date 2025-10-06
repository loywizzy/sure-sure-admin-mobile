import React, { useEffect, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUiStore } from '../../../lib/store';

type YearPickerSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (year: number) => void;
  value: number;
  years: number[];
};

export default function YearPickerSheet({ isVisible, onClose, onSelect, value, years }: YearPickerSheetProps) {
  const { theme } = useUiStore();
  const isDark = theme === 'dark';
  const ref = useRef<BottomSheetModal>(null);

  const sortedYears = useMemo(() => {
    if (!years.length) return [] as number[];
    return [...new Set(years)].sort((a, b) => b - a);
  }, [years]);

  useEffect(() => {
    if (isVisible) ref.current?.present();
    else ref.current?.dismiss();
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={['45%']}
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
        <View className="mb-6 items-center pt-1">
          <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">เลือกปี</Text>
          <Text className="mt-2 text-base text-gray-500 dark:text-gray-400">เลือกปีที่ต้องการดูรายได้รายเดือน</Text>
        </View>

        <View className="flex-1">
          {sortedYears.map((yearOption) => {
            const isActive = yearOption === value;
            return (
              <TouchableOpacity
                key={yearOption}
                onPress={() => onSelect(yearOption)}
                activeOpacity={0.85}
                className={`mb-3 rounded-xl border px-5 py-3 ${
                  isActive ? 'border-blue-300 bg-blue-50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`text-lg font-semibold ${isActive ? 'text-blue-700' : 'text-gray-900 dark:text-gray-100'}`}>
                    {yearOption}
                  </Text>
                  {isActive && <Text className="text-sm font-medium text-blue-600">กำลังแสดง</Text>}
                </View>
              </TouchableOpacity>
            );
          })}

          {sortedYears.length === 0 && (
            <View className="items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 dark:border-gray-700 dark:bg-gray-800/60 px-5 py-6">
              <Text className="text-sm text-gray-500 dark:text-gray-400">ยังไม่มีปีให้เลือก</Text>
            </View>
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

