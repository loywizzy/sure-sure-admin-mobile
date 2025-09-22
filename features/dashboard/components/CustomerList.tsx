import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function CustomerList() {
  const customers = [
    {
      id: '#00001',
      name: 'Neil Sims',
      email: 'neil.sims@flowbite.com',
      plan: 'Free Trial',
      amount: '100',
      date: '09/02/2588',
    },
    {
      id: '#00002',
      name: 'Bonnie Green',
      email: 'bonnie.green@flowbite.com',
      plan: 'Free Trial',
      amount: '100',
      date: '09/02/2588',
    },
    {
      id: '#00003',
      name: 'Neil Sims',
      email: 'neil.sims@flowbite.com',
      plan: 'Free Trial',
      amount: '100',
      date: '09/02/2588',
    },
    {
      id: '#00004',
      name: 'Neil Sims',
      email: 'neil.sims@flowbite.com',
      plan: 'Free Trial',
      amount: '100',
      date: '09/02/2588',
    },
  ];

  return (
    <View className="rounded-lg border border-gray-100 bg-white shadow-sm">
      <View className="border-b border-gray-100 p-4">
        <Text className="text-lg font-semibold text-gray-800">ลูกค้าที่เกี่ยวข้องกับร้านค้า</Text>
      </View>

      <ScrollView className="max-h-80">
        {customers.map((customer, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center border-b border-gray-50 p-4">
            {/* Avatar */}
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-300">
              <Text className="text-sm font-semibold text-gray-600">
                {customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>

            <View className="flex-1">
              <View className="mb-1 flex-row items-center">
                <Text className="mr-2 font-medium text-gray-800">{customer.name}</Text>
                <View className="rounded bg-green-100 px-2 py-1">
                  <Text className="text-xs text-green-700">{customer.plan}</Text>
                </View>
              </View>

              <Text className="mb-1 text-sm text-gray-500">
                {customer.id} {customer.email.split('@')[0]}
              </Text>
              <Text className="text-xs text-gray-400">รับชมอง: {customer.date}</Text>
            </View>

            <View className="items-end">
              <Text className="font-semibold text-gray-800">{customer.amount}</Text>
              <Text className="text-xs text-gray-400">฿</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity className="flex-row items-center justify-center border-t border-gray-100 p-4">
        <Text className="mr-2 text-sm font-medium text-blue-500">ดูทั้งหมด - อียะห์นข้อมูล</Text>
        <Text className="text-blue-500">→</Text>
      </TouchableOpacity>
    </View>
  );
}
