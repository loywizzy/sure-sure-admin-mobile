import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { listBranches } from '../lib/api';
import type { BranchItem } from '../lib/types';

type Branch = BranchItem;

export default function BranchesScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [query, setQuery] = useState(''); // ค้นหาได้ทั้งชื่อห้อง หรือ ชื่อ-นามสกุล
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 2 : 1; // มือถือ = 1 คอลัมน์, จอใหญ่ = 2 คอลัมน์

  const { data: branches = [], isLoading } = useQuery({ queryKey: ['branches'], queryFn: listBranches });

  const filtered = useMemo(() => {
    if (!query.trim()) return branches;
    const q = query.trim().toLowerCase();
    return branches.filter((b) =>
      b.roomName.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q)
    );
  }, [branches, query]);

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const BranchCard = ({ b }: { b: Branch }) => (
    <View
      className="mb-4 rounded-2xl border border-gray-200 bg-white"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}
    >
      <View className="border-b border-gray-100 px-5 py-4">
        <Text className="text-lg font-extrabold text-gray-900">{b.roomName} ({b.id})</Text>
      </View>

      <View className="px-5 py-2">
        <View className="flex-row items-start border-b border-gray-200 py-3">
          <Text className="w-32 text-sm text-gray-600">รหัสลูกค้า</Text>
          <View className="flex-1 items-end">
            <Text className="text-right text-sm font-medium text-gray-900">{b.code}</Text>
          </View>
        </View>
        <View className="flex-row items-start border-b border-gray-200 py-3">
          <Text className="w-32 text-sm text-gray-600">ชื่อ-นามสกุล</Text>
          <View className="flex-1 items-end">
            <Text className="text-right text-sm font-medium text-gray-900">{b.customerName}</Text>
          </View>
        </View>
        <View className="flex-row items-start border-b border-gray-200 py-3">
          <Text className="w-32 text-sm text-gray-600">โควต้าที่ใช้</Text>
          <View className="flex-1 items-end">
            <Text className="text-right text-sm font-medium text-gray-900">{b.usedQuota.toLocaleString()}</Text>
          </View>
        </View>
        <View className="flex-row items-start py-3">
          <Text className="w-32 text-sm text-gray-600">จำนวนเงินขั้นต่ำที่ได้รับ</Text>
          <View className="flex-1 items-end">
            <Text className="text-right text-sm font-medium text-gray-900">{b.minReceived.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="สาขาร้านค้า" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        {isLoading && (
          <View className="mb-4 rounded-xl bg-white p-4">
            <Text className="text-gray-500">กำลังโหลด...</Text>
          </View>
        )}
        {/* Search bar */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 rounded-2xl border border-gray-200 bg-white px-3 py-2">
            <View className="flex-row items-center">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="ชื่อห้อง , ชื่อ-นามสกุล"
                placeholderTextColor="#9ca3af"
                className="flex-1 px-1 text-sm text-gray-800"
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

        <View className="-mx-2 flex-row flex-wrap">
          {filtered.map((b) => (
            <View
              key={b.id}
              style={{ width: columns === 2 ? '50%' : '100%', paddingHorizontal: 8 }}
            >
              <BranchCard b={b} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


