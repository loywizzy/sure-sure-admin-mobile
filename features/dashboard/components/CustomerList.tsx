import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function CustomerList() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const customers = useMemo(() => [
    {
      id: '#00001',
      name: 'Neil Sims',
      role: 'merchant',
      email: 'email@example.com',
      plan: 'Free Trial',
      remain: 100,
      used: 0,
      expiredAt: '03/10/2568',
    },
    {
      id: '#00002',
      name: 'Neil Sims',
      role: 'merchant',
      email: 'email@example.com',
      plan: 'Free Trial',
      remain: 100,
      used: 0,
      expiredAt: '03/10/2568',
    },
    {
      id: '#00003',
      name: 'Neil Sims',
      role: 'merchant',
      email: 'email@example.com',
      plan: 'Free Trial',
      remain: 100,
      used: 0,
      expiredAt: '03/10/2568',
    },
  ], []);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase().replace('#', '');
    if (!q) return customers;
    return customers.filter((c) => {
      const name = c.name.toLowerCase();
      const id = c.id.replace('#', '').toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [customers, query]);

  return (
    <View className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <View className="border-b border-gray-100 px-5 py-4">
        <Text className="text-lg font-extrabold text-gray-900">ลูกค้าที่เปลี่ยนแพ็กเกจล่าสุด</Text>
      </View>

      {/* Search Row */}
      <View className="px-5 pt-3 pb-2">
        <View className="flex-row items-center">
          <View className="mr-3 flex-1">
            <View className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="รหัสลูกค้า , ชื่อ-นามสกุล"
                placeholderTextColor="#9ca3af"
                className="text-sm text-gray-800"
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Clear */}
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              className="items-center justify-center rounded-full border border-red-200 bg-white px-3 py-2">
              <Text className="text-base text-red-500">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="max-h-96">
        {filteredCustomers.map((c, idx) => (
          <TouchableOpacity key={idx} className="px-5 py-1">
            {/* ID */}
            <Text className="text-lg font-extrabold tracking-wide text-gray-900 py-3">{c.id}</Text>
            <View className="flex-row items-start justify-between">
              
              {/* Left: Avatar + Info */}
              <View className="flex-row items-start">
                
                {/* Avatar */}
                <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  
                  <Text className="text-base font-semibold text-gray-600">
                    {c.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>

                <View>
                  <Text className="mb-1 text-base font-semibold text-gray-900">{c.name}</Text>
                  <Text className="text-xs text-gray-500">{c.role}</Text>
                  <Text className="text-sm text-blue-600">{c.email}</Text>
                </View>
              </View>

              {/* Right: Plan */}
              <Text className="mt-1 text-right text-base font-semibold text-gray-800">{c.plan}</Text>
            </View>

            {/* Stats rows */}
            <View className="mt-2">
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-sm text-gray-600">จำนวนคงเหลือ</Text>
                <Text className="text-sm font-semibold text-gray-900">{c.remain}</Text>
              </View>
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-sm text-gray-600">จำนวนที่ใช้ไป</Text>
                <Text className="text-sm font-semibold text-gray-900">{c.used}</Text>
              </View>
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-sm text-gray-600">หมดอายุ</Text>
                <Text className="text-sm text-gray-900">{c.expiredAt}</Text>
              </View>
            </View>

            {/* Divider */}
            {idx !== customers.length - 1 && (
              <View className="mt-4 h-px w-full bg-gray-200" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity className="flex-row items-center justify-center border-t border-gray-100 px-5 py-4" onPress={() => router.push('/users')}>
        <Text className="mr-2 text-sm font-medium text-blue-600">ดูทั้งหมด</Text>
        <Text className="text-blue-600">→</Text>
      </TouchableOpacity>
    </View>
  );
}
