import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  title: string;
  mainValue: string;
  subValue?: string;
  changeValue?: string;
  changeType?: 'increase' | 'decrease';
  icon?: string;
  iconBgColor?: string;
}

export default function StatsCard({ 
  title, 
  mainValue, 
  subValue, 
  changeValue, 
  changeType = 'increase',
  icon = '📊',
  iconBgColor = 'bg-blue-500'
}: StatsCardProps) {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
      {/* Header with Icon and Title */}
      <View className="flex-row items-center justify-between mb-3">
        <View className={`w-8 h-8 ${iconBgColor} rounded-lg items-center justify-center`}>
          <Text className="text-white text-sm">{icon}</Text>
        </View>
        <Text className="text-xs text-gray-500 font-medium">{title}</Text>
      </View>
      
      {/* Main Value */}
      <Text className="text-2xl font-bold text-gray-800 mb-1">{mainValue}</Text>
      
      {/* Sub values and changes */}
      <View className="flex-row justify-between items-center">
        {subValue && (
          <Text className="text-sm text-gray-600">{subValue}</Text>
        )}
        
        {changeValue && (
          <View className="flex-row items-center">
            <Text className={`text-xs font-medium ${
              changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {changeType === 'increase' ? '↗' : '↘'} {changeValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
