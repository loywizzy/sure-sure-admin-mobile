import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../lib/services/userService';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { data: user } = useQuery({ queryKey: ['users', id], queryFn: async () => (id ? await userService.fetchUserByUid(String(id)) : undefined), enabled: Boolean(id) });

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  if (!user) {
    return (
      <View className="flex-1 bg-gray-50">
        <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
        <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">ไม่พบผู้ใช้</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        <View className="rounded-2xl border border-gray-100 bg-white p-6" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }}>
          <Text className="mb-2 font-mono text-base tracking-widest text-gray-900">{user.id} <Text className={user.active ? 'text-green-600' : 'text-red-500'}>({user.active ? 'Active' : 'Inactive'})</Text></Text>
          <Text className="mb-4 text-4xl font-extrabold text-gray-900">{user.firstName}{user.lastName ? ` ${user.lastName}` : ''}</Text>

          <View className="mb-5">
            <Text className="text-base text-gray-700">อีเมล: {user.email}</Text>
            <Text className="text-base text-gray-700">ประเภท: {user.role}</Text>
            <Text className="text-base text-gray-700">แพ็คเกจสมัคร: {user.packageCode}</Text>
            <Text className="text-base text-gray-700">จำนวนที่ใช้ไป: {user.usedCount}</Text>
            <Text className="text-base text-gray-700">คงเหลือใช้งาน: {user.remaining}</Text>
            <Text className="text-base text-gray-700">วันหมดอายุ: {new Date(user.expiresAt).toLocaleDateString('th-TH')}</Text>
          </View>

          <View className="flex-row justify-start">
            <TouchableOpacity className="mr-3 rounded-full bg-red-500 px-6 py-2" onPress={() => router.replace('/users')}>
              <Text className="text-white">ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-blue-600 px-6 py-2" onPress={() => router.push({ pathname: '/users/edit', params: { id: user.uid || user.id } })}>
              <Text className="text-white">แก้ไข</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


