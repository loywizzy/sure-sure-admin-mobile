import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function LineChartComponent() {
  const screenWidth = Dimensions.get('window').width;

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
      <Text className="mb-4 text-lg font-bold text-gray-800">สถิติรายได้แบบเดือน (บาท)</Text>

      <LineChart
        data={{
          labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
          datasets: [
            {
              data: [120000, 180000, 250000, 95000, 320000, 450000, 280000],
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              strokeWidth: 3,
            },
          ],
          legend: ['รายได้จากแพ็คเกจ (บาท)'],
        }}
        width={screenWidth - 32 - 32} // screenWidth - padding
        height={220}
        yAxisLabel="฿"
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f8fafc',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#3b82f6',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withDots={true}
        withShadow={true}
        withInnerLines={true}
        withOuterLines={false}
      />
    </View>
  );
}
