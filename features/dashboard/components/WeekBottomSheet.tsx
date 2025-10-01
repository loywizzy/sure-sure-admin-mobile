import React, { useEffect, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (dt: Date) => dt.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
  const year = end.toLocaleDateString('th-TH', { year: 'numeric' });
  return `${fmt(start)}–${fmt(end)} ${year}`;
}

export default function WeekBottomSheet({
  isVisible,
  onClose,
  onSelect,
  currentWeekISO,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (iso: string) => void;
  currentWeekISO: string;
}) {
  const ref = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  useEffect(() => {
    if (isVisible) ref.current?.present();
    else ref.current?.dismiss();
  }, [isVisible]);

  const nowMonday = getMonday(new Date());
  const weeks = useMemo(() => {
    const items: Date[] = [];
    const start = getMonday(new Date());
    for (let i = 0; i < 26; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() - i * 7);
      items.push(d);
    }
    return items;
  }, []);

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
      backgroundStyle={{ backgroundColor: '#111827', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: '#6b7280', width: 36, height: 4, borderRadius: 999 }}
    >
      <BottomSheetView className="flex-1 px-6">
        <View className="mb-5 items-center pt-1">
          <Text className="text-2xl font-extrabold text-gray-100">เลือกสัปดาห์</Text>
          <Text className="mt-1 text-base text-gray-400">สัปดาห์เริ่มวันจันทร์–อาทิตย์</Text>
        </View>

        {/* Quick chips */}
        <View className="mb-4 flex-row justify-center">
          <TouchableOpacity
            className="mx-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
            onPress={() => onSelect(getMonday(new Date()).toISOString())}
          >
            <Text className="text-blue-700">สัปดาห์นี้</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mx-1 rounded-full border border-gray-200 bg-white dark:bg-gray-800 px-4 py-2"
            onPress={() => {
              const d = getMonday(new Date());
              d.setDate(d.getDate() - 7);
              onSelect(d.toISOString());
            }}
          >
            <Text className="text-gray-700 dark:text-gray-300">สัปดาห์ที่แล้ว</Text>
          </TouchableOpacity>
        </View>

        {weeks.map((w, idx) => {
          const iso = w.toISOString();
          const isCurrent = iso === currentWeekISO;
          const isThisWeek = w.getTime() === nowMonday.getTime();
          return (
            <TouchableOpacity
              key={idx}
              className={`mb-3 rounded-xl border px-4 py-3 ${isCurrent ? 'bg-blue-50 border-blue-200' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
              onPress={() => onSelect(iso)}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-base ${isCurrent ? 'text-blue-700' : 'text-gray-800 dark:text-gray-100'}`}>{formatRange(w)}</Text>
                {isThisWeek && <Text className="text-xs text-blue-600">สัปดาห์นี้</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </BottomSheetView>
    </BottomSheetModal>
  );
}


