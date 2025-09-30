import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../lib/services/userService';
import type { UserItem } from '../lib/types';
import { router } from 'expo-router';

export default function UsersScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [query, setQuery] = useState('');
  const { data: items = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: userService.fetchUsers });
  useWindowDimensions();
  const columns = 2; // แสดง 2 การ์ดต่อแถวตามคำขอ

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((u) =>
      u.code.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const Card = ({ u }: { u: UserItem }) => (
    <View
      className="mb-4 rounded-2xl border border-gray-200 bg-white p-4"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
    >
      <Text className="mb-2 font-mono text-base tracking-widest text-gray-700">{u.code} (Merchant)</Text>
      <Text className="mb-4 text-2xl font-extrabold text-gray-900">{[u.firstName, u.lastName].filter(Boolean).join(' ')}</Text>
      <TouchableOpacity
        className="self-start rounded-full bg-blue-600 px-4 py-2"
        onPress={() => router.push({ pathname: '/users/[id]', params: { id: u.uid || u.id } })}
      >
        <Text className="text-white">ดูข้อมูลเพิ่มเติม</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-2">
            <View className="flex-row items-center">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="รหัสลูกค้า , ชื่อ-นามสกุล"
                placeholderTextColor="#9ca3af"
                className="flex-1 px-1 text-base text-gray-800"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} className="ml-2 h-8 w-8 items-center justify-center rounded-full border border-red-200">
                  <Text className="text-red-500">✕</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <Text className="text-white">🔎</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isLoading && (
          <View className="mb-4 rounded-xl bg-white p-4"><Text className="text-gray-500">กำลังโหลด...</Text></View>
        )}

        <View className="-mx-2 flex-row flex-wrap">
          {filtered.map((u) => (
            <View key={u.id} style={{ width: columns === 2 ? '50%' : '100%', paddingHorizontal: 8 }}>
              <Card u={u} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


