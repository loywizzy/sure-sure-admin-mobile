import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { packageService } from '../lib/services/packageService';
import type { PackageItem } from '../lib/types';

export default function PackagesScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [query, setQuery] = useState('');
  const { data: items = [], isLoading } = useQuery({ queryKey: ['packages'], queryFn: packageService.fetchPackages });

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
  }, [items, query]);

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  const formatNumber = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const formatPrice = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const openEdit = (pkg: PackageItem) => router.push({ pathname: '/packages/edit', params: { code: pkg.code } });
  const openCreate = () => router.push('/packages/create');

  // full-screen forms are separate routes

  const PackageCard = ({ item }: { item: PackageItem }) => (
    <View
      className="mx-3 mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 }}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-mono tracking-widest text-gray-800 dark:text-gray-300">{item.code}</Text>
        <Text className={`text-sm ${item.active ? 'text-green-600' : 'text-red-500'}`}>
          ({item.active ? 'Active' : 'Deactive'})
        </Text>
      </View>
      <Text className="mb-3 text-2xl font-extrabold text-gray-900 dark:text-gray-100">{item.name}</Text>

      <View className="mb-4">
        <Text className="text-gray-700 dark:text-gray-300">💰 ราคา: {formatPrice(item.price)} บาท</Text>
        <Text className="text-gray-700 dark:text-gray-300">📊 ใช้งานสูงสุด: {formatNumber(item.maxQuota)}</Text>
        <Text className="text-gray-700 dark:text-gray-300">🏆 คงเหลือ: {formatNumber(item.remaining)}</Text>
        <Text className="text-gray-700 dark:text-gray-300">⏳ ระยะเวลา: {item.durationDays} วัน</Text>
      </View>

      <TouchableOpacity className="self-start rounded-full bg-blue-600 px-5 py-2" onPress={() => openEdit(item)}>
        <Text className="text-white">แก้ไข</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <Navbar onMenuPress={handleMenuPress} title="แพ็คเกจ" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        {isLoading && (
          <View className="mb-4 rounded-xl bg-white dark:bg-gray-900 p-4">
            <Text className="text-gray-500 dark:text-gray-400">กำลังโหลด...</Text>
          </View>
        )}
        {/* Search bar */}
        <View className="mb-4 flex-row items-center">
          <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2">
            <View className="flex-row items-center">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="รหัสแพ็คเกจ , ชื่อแพ็คเกจ"
                placeholderTextColor="#9ca3af"
                className="flex-1 px-1 text-sm text-gray-800 dark:text-gray-200"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} className="ml-2 h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white dark:bg-gray-900">
                  <Text className="text-red-500">✕</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <Text className="text-white">🔎</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {filtered.map((it) => (
          <PackageCard key={it.code} item={it} />
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={openCreate}
        style={{ position: 'absolute', right: 24, bottom: 24 }}
        className="h-12 w-12 items-center justify-center rounded-full bg-blue-600"
      >
        <Text className="text-2xl text-white">＋</Text>
      </TouchableOpacity>

      {/* Full-screen forms handled by routes */}
    </View>
  );
}


