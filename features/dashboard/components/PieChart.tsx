import React, { useMemo, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import PieChartMonthSheet from './PieChartMonthSheet';

export default function PieChartComponent() {
  const screenWidth = Dimensions.get('window').width;
  const [pickerVisible, setPickerVisible] = useState(false);
  const now = new Date();
  const [selected, setSelected] = useState({ monthIndex: now.getMonth(), year: now.getFullYear() });

  const data = useMemo(() => [
    {
      name: 'ลูกค้าใหม่',
      population: 25,
      color: '#3b82f6',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'เลขบัญชีในครอบครัว',
      population: 15,
      color: '#eab308',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'สลิปที่ถูกต้อง',
      population: 15,
      color: '#22c55e',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'อ่านบางเงินบ่อยกว่าขั้นต่ำ',
      population: 15,
      color: '#059669',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'สลิปที่มีข้อผิดพลาด',
      population: 15,
      color: '#ec4899',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
    {
      name: 'เก็บข้อมูลพลาด',
      population: 15,
      color: '#6b7280',
      legendFontColor: '#374151',
      legendFontSize: 12,
    },
  ], [selected]);

  const monthLabel = useMemo(() => {
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    return `${months[selected.monthIndex]} ${selected.year}`;
  }, [selected]);

  return (
    <View
      className="mb-4 rounded-xl border border-gray-50 bg-white p-4 shadow-xl"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-800">สถิติโดยรวมแบบรายเดือน</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3 flex-row items-center rounded-lg bg-gray-50 px-3 py-2" onPress={() => setPickerVisible(true)}>
            <Text className="mr-1 text-sm text-gray-600">{monthLabel}</Text>
            <Text className="text-gray-400">▼</Text>
          </TouchableOpacity>
          <Text className="font-bold text-blue-500">↗ 98%</Text>
        </View>
      </View>

      <PieChart
        data={data}
        width={screenWidth - 32 - 32} // screenWidth - padding
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f8fafc',
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[10, 0]}
        absolute={true}
        hasLegend={true}
        style={{
          borderRadius: 16,
        }}
      />
      <PieChartMonthSheet
        isVisible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        value={selected}
        onSelect={(monthIndex, year) => {
          setSelected({ monthIndex, year });
          setPickerVisible(false);
        }}
      />
    </View>
  );
}
