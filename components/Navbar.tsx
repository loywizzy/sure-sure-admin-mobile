import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../lib/store';

interface NavbarProps {
  onMenuPress: () => void;
  title?: string;
}

export default function Navbar({ onMenuPress, title = 'แดชบอร์ด' }: NavbarProps) {
  const { name } = useAuthStore();
  const initial = (name || 'U').trim().charAt(0).toUpperCase();
  return (
    <View className="flex-row items-center justify-between border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-4 py-3">
      {/* Left side - Menu button */}
      <TouchableOpacity onPress={onMenuPress} className="-ml-2 p-2" activeOpacity={0.7}>
        <View className="h-6 w-6 justify-between">
          <View className="h-0.5 w-full bg-gray-700" />
          <View className="h-0.5 w-full bg-gray-700" />
          <View className="h-0.5 w-full bg-gray-700" />
        </View>
      </TouchableOpacity>

      {/* Center - Title */}
      {title && (
        <Text className="-mr-10 flex-1 text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </Text>
      )}
      {!title && <View className="flex-1" />}

      {/* Right side - Profile */}
      <TouchableOpacity
        className="h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700"
        activeOpacity={0.7}>
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-200">{initial}</Text>
      </TouchableOpacity>
    </View>
  );
}
