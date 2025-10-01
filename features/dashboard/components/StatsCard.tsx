import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  title: string;
  mainValue: string;
  subItems?: {
    label: string;
    value: string;
    color: 'green' | 'red';
  }[];
  icon?: string;
  iconBgColor?: string;
  isHeroCard?: boolean;
  isMiniCard?: boolean;
}

export default function StatsCard({
  title,
  mainValue,
  subItems = [],
  icon = '💰',
  iconBgColor = 'bg-blue-500',
  isHeroCard = false,
  isMiniCard = false,
}: StatsCardProps) {
  if (isHeroCard) {
    // Hero Card Layout - Horizontal layout with more space
    return (
      <View
        className="rounded-3xl border-0 bg-white dark:bg-gray-900 p-6 shadow-xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 10,
        }}>
        <View className="flex-row items-center">
          {/* Icon Section */}
          <View
            className={`h-20 w-20 ${iconBgColor} mr-5 items-center justify-center rounded-3xl`}
            style={{
              shadowColor: iconBgColor.includes('emerald') ? '#10b981' : '#3b82f6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}>
            <Text className="text-3xl text-white">{icon}</Text>
          </View>

          {/* Content Section */}
          <View className="flex-1">
            <Text className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {title}
            </Text>
            <Text className="mb-3 text-4xl font-black text-gray-900 dark:text-gray-100">{mainValue}</Text>

            {/* Sub Items - Vertical in Hero Card */}
            {subItems.length > 0 && (
              <View className="mt-2">
                {subItems.map((item, index) => (
                  <View
                    key={index}
                    className={`flex-row items-center justify-between ${index > 0 ? 'mt-2' : ''}`}>
                    <View className="flex-1 flex-row items-center">
                      <View
                        className={`mr-3 h-3 w-3 rounded-full ${
                          item.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      />
                      <Text className="flex-1 text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</Text>
                    </View>
                    <View
                      className={`rounded-lg px-3 py-1 ${
                        item.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                      <Text
                        className={`text-sm font-bold ${
                          item.color === 'green' ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {item.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  if (isMiniCard) {
    // Mini Card Layout - Compact vertical layout
    return (
      <View
        className="rounded-2xl border-0 bg-white dark:bg-gray-900 p-3 shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 6,
        }}>
        <View className="mb-3 items-center">
          <View
            className={`h-12 w-12 ${iconBgColor} mb-2 items-center justify-center rounded-2xl`}
            style={{
              shadowColor: iconBgColor.includes('blue')
                ? '#3b82f6'
                : iconBgColor.includes('purple')
                  ? '#8b5cf6'
                  : '#f97316',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Text className="text-lg text-white">{icon}</Text>
          </View>
          <Text className="mb-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-2xl font-black text-gray-900 dark:text-gray-100">{mainValue}</Text>
        </View>

        {/* Sub Items - Compact for mini cards */}
        {subItems.length > 0 && (
          <View className="rounded-xl bg-gray-50 dark:bg-gray-800 p-2">
            {subItems.map((item, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between ${index > 0 ? 'mt-1' : ''}`}>
                <View className="flex-1 flex-row items-center">
                  <View
                    className={`mr-2 h-2 w-2 rounded-full ${
                      item.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <Text className="flex-1 text-xs font-medium text-gray-600 dark:text-gray-300" numberOfLines={1}>
                    {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
                  </Text>
                </View>
                <Text
                  className={`text-xs font-bold ${
                    item.color === 'green' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  // Default Card Layout (unchanged for backward compatibility)
  return (
    <View
      className="rounded-3xl border-0 bg-white dark:bg-gray-900 p-5 shadow-xl"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 10,
      }}>
      {/* Header with Icon and Title */}
      <View className="mb-4 flex-col items-center text-center">
        <View
          className={`h-16 w-16 ${iconBgColor} mb-3 items-center justify-center rounded-3xl`}
          style={{
            shadowColor: iconBgColor.includes('emerald')
              ? '#10b981'
              : iconBgColor.includes('blue')
                ? '#3b82f6'
                : iconBgColor.includes('purple')
                  ? '#8b5cf6'
                  : '#f97316',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Text className="text-2xl text-white">{icon}</Text>
        </View>
        <View className="w-full items-center">
          <Text className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {title}
          </Text>
          <Text className="mb-1 text-center text-3xl font-black text-gray-900 dark:text-gray-100">{mainValue}</Text>
        </View>
      </View>

      {/* Sub Items */}
      {subItems.length > 0 && (
        <View
          className="mt-2 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}>
          {subItems.map((item, index) => (
            <View
              key={index}
              className={`flex-row items-center justify-between ${index > 0 ? 'mt-2' : ''}`}>
              <View className="flex-1 flex-row items-center">
                <View
                  className={`mr-2 h-3 w-3 rounded-full ${
                    item.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                  }`}
                  style={{
                    shadowColor: item.color === 'green' ? '#10b981' : '#ef4444',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
                <Text className="flex-1 text-xs font-semibold text-gray-600 dark:text-gray-300" numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
              <View
                className={`rounded-xl px-2 py-1 ${
                  item.color === 'green' ? 'bg-green-200' : 'bg-red-200'
                }`}>
                <Text
                  className={`text-xs font-black ${
                    item.color === 'green' ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
