import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', title: 'แดชบอร์ด', icon: '🏠' },
    { id: 'users', title: 'ผู้ใช้งาน', icon: '👤' },
    { id: 'transactions', title: 'ธุรกรรม', icon: '📄' },
    { id: 'parking', title: 'ลานรถเมก์', icon: '📅' },
    { id: 'packages', title: 'แพ็คเกจ', icon: '📊' },
  ];

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Overlay Background */}
      <TouchableOpacity 
        className="flex-1 bg-black/50" 
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Sidebar Container */}
        <View className="flex-row">
          <TouchableOpacity 
            activeOpacity={1} 
            className="w-64 bg-white h-full shadow-lg"
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView className="flex-1">
              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                className="absolute top-4 right-4 z-10 p-2"
                activeOpacity={0.7}
              >
                <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>

              {/* Header Section */}
              <View className="p-6 border-b border-gray-200 pt-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-10 h-10 bg-gray-300 rounded-full mr-3 items-center justify-center">
                    <Text className="text-gray-600 font-semibold">T</Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500 uppercase tracking-wide">
                      ADMIN STORE
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      TATAR
                    </Text>
                  </View>
                </View>
              </View>

              {/* Main Menu Section */}
              <View className="pt-6">
                <Text className="px-6 mb-4 text-xs text-gray-500 uppercase tracking-wide">
                  MAIN
                </Text>
                
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="mx-4 mb-1 px-3 py-3 rounded-lg flex-row items-center"
                    activeOpacity={0.7}
                    onPress={() => {
                      // Handle navigation here
                      onClose();
                    }}
                  >
                    <Text className="mr-3 text-base">
                      {item.icon}
                    </Text>
                    <Text className="text-gray-700 text-sm font-medium">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Settings Section */}
              <View className="pt-6">
                <Text className="px-6 mb-4 text-xs text-gray-500 uppercase tracking-wide">
                  SETTINGS
                </Text>
                
                <TouchableOpacity
                  className="mx-4 mb-1 px-3 py-3 rounded-lg flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Text className="mr-3 text-base">⚙️</Text>
                  <Text className="text-gray-700 text-sm font-medium">
                    ตั้งค่า
                  </Text>
                  <View className="flex-1" />
                  <Text className="text-gray-500 text-xs">▼</Text>
                </TouchableOpacity>
              </View>

              {/* Spacer to push bottom items down */}
              <View className="flex-1 min-h-20" />
              
              {/* Bottom Actions */}
              <View className="pb-6 pt-4">
                <TouchableOpacity
                  className="mx-4 mb-2 px-3 py-3 rounded-lg flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Text className="mr-3 text-base">❓</Text>
                  <Text className="text-gray-700 text-sm font-medium">
                    ช่วยเหลือ
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="mx-4 px-3 py-3 rounded-lg flex-row items-center"
                  activeOpacity={0.7}
                >
                  <Text className="mr-3 text-base">🚪</Text>
                  <Text className="text-red-500 text-sm font-medium">
                    ออกจากระบบ
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
          
          {/* Empty space for the rest of the screen */}
          <View className="flex-1" />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
