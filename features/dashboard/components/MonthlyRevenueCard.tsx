import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const monthsTh = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

const formatShort = (n: number) => {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n/1_000).toFixed(1)}k`;
  return String(n);
};

export default function MonthlyRevenueCard() {
  const screenWidth = Dimensions.get('window').width;
  const [year, setYear] = useState(new Date().getFullYear());

  // mock data per year
  const values = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const base = ((year % 7) + 1) * 1000 + i * 300; // ใช้ year เพื่อรีคอมพิวต์ค่า
      return Math.round(base + Math.random() * 90000) + 10000;
    }),
  [year]);

  const barWidth = 48;
  const paddingX = 32 + 40;
  const chartWidth = Math.max(screenWidth - paddingX, monthsTh.length * barWidth);

  const total = values.reduce((a,b)=>a+b,0);

  return (
    <View
      className="rounded-xl border border-gray-50 bg-white p-5 shadow-xl"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 }}
    >
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800">รายได้รายเดือน (บาท)</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-2 rounded-lg bg-gray-50 px-3 py-2" onPress={() => setYear((y) => y-1)}>
            <Text className="text-gray-600">‹</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg bg-gray-50 px-3 py-2">
            <Text className="text-sm text-gray-600">{year}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="ml-2 rounded-lg bg-gray-50 px-3 py-2" onPress={() => setYear((y) => y+1)}>
            <Text className="text-gray-600">›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="-mt-4 mb-3 text-sm text-gray-500">รายได้จากแพ็คเกจ</Text>

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
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f8fafc',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
            labelColor: (opacity = 1) => `rgba(107,114,128,${opacity})`,
            propsForBackgroundLines: { strokeDasharray: '3,6', stroke: '#e5e7eb' },
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
        <Text className="text-sm text-gray-600">รวมทั้งปี</Text>
        <Text className="text-sm font-semibold text-gray-900">{total.toLocaleString('th-TH')}</Text>
      </View>
    </View>
  );
}


