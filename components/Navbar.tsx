import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface NavbarProps {
  onMenuPress: () => void;
  title?: string;
}

export default function Navbar({ onMenuPress, title = "แดชบอร์ด" }: NavbarProps) {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
      {/* Left side - Menu button */}
      <TouchableOpacity
        onPress={onMenuPress}
        className="p-2 -ml-2"
        activeOpacity={0.7}
      >
        <View className="w-6 h-6 justify-between">
          <View className="w-full h-0.5 bg-gray-700" />
          <View className="w-full h-0.5 bg-gray-700" />
          <View className="w-full h-0.5 bg-gray-700" />
        </View>
      </TouchableOpacity>

      {/* Center - Title */}
      {title && (
        <Text className="text-lg font-semibold text-gray-800 flex-1 text-center -mr-10">
          {title}
        </Text>
      )}
      {!title && <View className="flex-1" />}

      {/* Right side - Profile */}
      <TouchableOpacity
        className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center"
        activeOpacity={0.7}
      >
        <Text className="text-gray-600 font-medium text-sm">T</Text>
      </TouchableOpacity>
    </View>
  );
}
