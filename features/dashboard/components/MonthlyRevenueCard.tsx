import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useQuery } from '@tanstack/react-query';
import { orderPackageService } from '../../../lib/services/orderPackageService';
import { useUiStore } from '../../../lib/store';
import YearPickerSheet from './YearPickerSheet';

const monthsTh = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

const formatShort = (n: number) => {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n/1_000).toFixed(1)}k`;
  return String(n);
};

export default function MonthlyRevenueCard() {
  const screenWidth = Dimensions.get('window').width;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const { theme } = useUiStore();
  const isDark = theme === 'dark';

  const { data: orders = [] } = useQuery({ queryKey: ['order-packages'], queryFn: orderPackageService.fetchOrderPackages });
  // sum รายได้รายเดือนจาก order-package (เฉพาะ SUCCESS)
  const values = useMemo(() => {
    const arr = Array(12).fill(0) as number[];
    for (const o of orders) {
      if (o.status !== 'SUCCESS') continue;
      const d = new Date(o.created_date);
      if (d.getFullYear() !== year) continue;
      arr[d.getMonth()] += Number(o.price || 0);
    }
    return arr.map(Math.round);
  }, [orders, year]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    orders.forEach((o) => {
      const created = new Date(o.created_date);
      if (!Number.isNaN(created.getTime())) {
        set.add(created.getFullYear());
      }
    });
    const fallbackYears = Array.from({ length: 6 }, (_, idx) => currentYear - idx);
    fallbackYears.forEach((yr) => set.add(yr));
    set.add(year);
    return Array.from(set).sort((a, b) => b - a);
  }, [orders, year, currentYear]);

  const barWidth = 48;
  const paddingX = 32 + 40;
  const chartWidth = Math.max(screenWidth - paddingX, monthsTh.length * barWidth);

  const total = values.reduce((a,b)=>a+b,0);

  return (
    <View
      className="rounded-xl border border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xl"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 }}
    >
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">รายได้รายเดือน</Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-2"
          activeOpacity={0.85}
          onPress={() => setShowYearPicker(true)}
        >
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">{year}</Text>
          <Text className="text-gray-500 dark:text-gray-400">▾</Text>
        </TouchableOpacity>
      </View>

      <Text className="-mt-4 mb-3 text-sm text-gray-500 dark:text-gray-400">รายได้จากแพ็คเกจ (บาท)</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={{ labels: monthsTh, datasets: [{ data: values }] }}
          width={chartWidth}
          height={220}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: isDark ? '#111827' : '#ffffff',
            backgroundGradientFrom: isDark ? '#111827' : '#ffffff',
            backgroundGradientTo: isDark ? '#0b1220' : '#f8fafc',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
            labelColor: (opacity = 1) => isDark ? `rgba(156,163,175,${opacity})` : `rgba(107,114,128,${opacity})`,
            propsForBackgroundLines: { strokeDasharray: '3,6', stroke: isDark ? '#374151' : '#e5e7eb' },
            barPercentage: 0.6,
            fillShadowGradientFrom: '#3b82f6',
            fillShadowGradientFromOpacity: 0.85,
            fillShadowGradientTo: '#1d4ed8',
            fillShadowGradientToOpacity: 0.95,
            formatYLabel: (v: string) => formatShort(Number(v)),
          }}
          verticalLabelRotation={0}
          style={{ borderRadius: 16, marginVertical: 6 }}
        />
      </ScrollView>

      <View className="mt-3 flex-row justify-between">
        <Text className="text-sm text-gray-600 dark:text-gray-400">รวมทั้งปี</Text>
        <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">{total.toLocaleString('th-TH')}</Text>
      </View>

      <YearPickerSheet
        isVisible={showYearPicker}
        onClose={() => setShowYearPicker(false)}
        onSelect={(selectedYear) => {
          setYear(selectedYear);
          setShowYearPicker(false);
        }}
        value={year}
        years={availableYears}
      />
    </View>
  );
}

