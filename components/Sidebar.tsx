import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start off screen
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', title: 'แดชบอร์ด', icon: '🏠' },
    { id: 'users', title: 'ผู้ใช้งาน', icon: '👤' },
    { id: 'transactions', title: 'ธุรกรรม', icon: '📄' },
    { id: 'branches', title: 'สาขาร้านค้า', icon: '🏪' },
    { id: 'packages', title: 'แพ็คเกจ', icon: '📊' },
  ];

  useEffect(() => {
    if (isVisible) {
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  return (
    <Modal animationType="none" transparent={true} visible={isVisible} onRequestClose={onClose}>
      {/* Overlay Background */}
      <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={onClose}>
        {/* Sidebar Container */}
        <View className="h-full flex-row">
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
            }}>
            <View className="h-full w-64 bg-white shadow-lg">
              <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={(e) => e.stopPropagation()}>
                <ScrollView className="flex-1">
                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={onClose}
                    className="absolute right-4 top-4 z-10 p-2"
                    activeOpacity={0.7}>
                    <Text className="text-lg text-gray-500">✕</Text>
                  </TouchableOpacity>

                  {/* Header Section */}
                  <View className="border-b border-gray-200 p-6 pt-4">
                    <View className="mb-2 flex-row items-center">
                      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                        <Text className="font-semibold text-gray-600">T</Text>
                      </View>
                      <View>
                        <Text className="text-xs uppercase tracking-wide text-gray-500">
                          ADMIN STORE
                        </Text>
                        <Text className="text-base font-semibold text-gray-800">TATAR</Text>
                      </View>
                    </View>
                  </View>

                  {/* Main Menu Section */}
                  <View className="pt-6">
                    <Text className="mb-4 px-6 text-xs uppercase tracking-wide text-gray-500">
                      MAIN
                    </Text>

                    {menuItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        className="mx-4 mb-1 flex-row items-center rounded-lg px-3 py-3"
                        activeOpacity={0.7}
                        onPress={() => {
                          if (item.id === 'transactions') {
                            router.push('/transactions');
                          }
                          if (item.id === 'dashboard') {
                            router.push('/');
                          }
                          if (item.id === 'branches') {
                            router.push('/branches');
                          }
                          onClose();
                        }}>
                        <Text className="mr-3 text-base">{item.icon}</Text>
                        <Text className="text-sm font-medium text-gray-700">{item.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Settings Section */}
                  <View className="pt-6">
                    <Text className="mb-4 px-6 text-xs uppercase tracking-wide text-gray-500">
                      SETTINGS
                    </Text>

                    <TouchableOpacity
                      className="mx-4 mb-1 flex-row items-center rounded-lg px-3 py-3"
                      activeOpacity={0.7}>
                      <Text className="mr-3 text-base">⚙️</Text>
                      <Text className="text-sm font-medium text-gray-700">ตั้งค่า</Text>
                      <View className="flex-1" />
                      <Text className="text-xs text-gray-500">▼</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Spacer to push bottom items down */}
                  <View className="min-h-20 flex-1" />

                  {/* Bottom Actions */}
                  <View className="pb-6 pt-4">
                    <TouchableOpacity
                      className="mx-4 mb-2 flex-row items-center rounded-lg px-3 py-3"
                      activeOpacity={0.7}>
                      <Text className="mr-3 text-base">❓</Text>
                      <Text className="text-sm font-medium text-gray-700">ช่วยเหลือ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="mx-4 flex-row items-center rounded-lg px-3 py-3"
                      activeOpacity={0.7}>
                      <Text className="mr-3 text-base">🚪</Text>
                      <Text className="text-sm font-medium text-red-500">ออกจากระบบ</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Empty space for the rest of the screen */}
          <View className="flex-1" />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
