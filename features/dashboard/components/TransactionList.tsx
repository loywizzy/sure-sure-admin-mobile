import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import SearchBottomSheet from './SearchBottomSheet';
import CrossPlatformDatePicker from '../../../components/ui/CrossPlatformDatePicker';

interface VerificationRecord {
  id: string;
  date: string;
  firstName: string;
  lastName: string;
  type: string;
  status: 'สำเร็จ' | 'ไม่สำเร็จ' | 'รอตรวจสอบ';
}

export default function TransactionList() {
  const [showSearchBottomSheet, setShowSearchBottomSheet] = useState(false);

  // Form states for external search
  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const verificationRecords: VerificationRecord[] = useMemo(
    () => [
      {
        id: 'TXN2948239489230',
        date: 'Apr 23, 2021',
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        type: 'ตรวจสอบบัตรประชาชน',
        status: 'สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 23, 2021',
        firstName: 'สมหญิง',
        lastName: 'รักดี',
        type: 'ตรวจสอบใบหน้า',
        status: 'ไม่สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 18, 2021',
        firstName: 'วิทยา',
        lastName: 'เก่งมาก',
        type: 'ตรวจสอบใบหน้า',
        status: 'ไม่สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 15, 2021',
        firstName: 'มานะ',
        lastName: 'ขยันดี',
        type: 'ตรวจสอบใบหน้า',
        status: 'ไม่สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 15, 2021',
        firstName: 'ประสิทธิ์',
        lastName: 'รวยมาก',
        type: 'ตรวจสอบบัตรประชาชน',
        status: 'สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 11, 2021',
        firstName: 'วิชัย',
        lastName: 'สบายใจ',
        type: 'ตรวจสอบบัตรประชาชน',
        status: 'สำเร็จ',
      },
    ],
    []
  );

  const formatDate = (date: Date | null): string => {
    if (!date) {
      return 'เลือกวันที่';
    }

    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filter records based on search parameters
  const filteredRecords = useMemo(() => {
    return verificationRecords.filter((record) => {
      // Check name filter (combines firstName and lastName)
      if (searchName) {
        const fullName = `${record.firstName} ${record.lastName}`.toLowerCase();
        if (!fullName.includes(searchName.toLowerCase())) {
          return false;
        }
      }

      // Check status filter
      if (selectedStatus && record.status !== selectedStatus) {
        return false;
      }

      // Check date range (simplified - assumes date string format)
      // In real implementation, you'd parse dates properly
      return true;
    });
  }, [searchName, selectedStatus, verificationRecords]);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
  };

  const clearSearch = () => {
    setSearchName('');
    setSelectedStatus('');
    setStartDate(null);
    setEndDate(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'สำเร็จ':
        return 'text-green-500';
      case 'ไม่สำเร็จ':
        return 'text-red-500';
      case 'รอตรวจสอบ':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <View className="mb-4">
      {/* Search Section - Outside Component */}
      <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
        <View className="mb-4 flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-900">ค้นหาธุรกรรม</Text>
            <Text className="text-sm text-gray-500">กำหนดช่วงวันที่ สถานะ หรือชื่อที่ต้องการ</Text>
          </View>
          {(searchName || selectedStatus || startDate || endDate) && (
            <TouchableOpacity
              onPress={clearSearch}
              className="flex-row items-center rounded-full bg-gray-100 px-3 py-2">
              <Text className="mr-1 text-xs text-gray-500">รีเซ็ต</Text>
              <Text className="text-sm text-gray-500">↺</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Date Range Section */}
        <View className="mb-4 flex-row space-x-3">
          <View className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              วันเริ่มต้น
            </Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              className="flex-row items-center justify-between">
              <Text className={`text-sm ${startDate ? 'text-gray-900' : 'text-gray-400'}`}>
                {formatDate(startDate)}
              </Text>
              <Text className="text-gray-400">📅</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              วันสิ้นสุด
            </Text>
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              className="flex-row items-center justify-between">
              <Text className={`text-sm ${endDate ? 'text-gray-900' : 'text-gray-400'}`}>
                {formatDate(endDate)}
              </Text>
              <Text className="text-gray-400">📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filters */}
        <View className="flex-row space-x-3">
          <View className="flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              ค้นหาชื่อ-นามสกุล
            </Text>
            <TextInput
              value={searchName}
              onChangeText={setSearchName}
              placeholder="เช่น สมชาย ใจดี"
              className="text-sm text-gray-800"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowSearchBottomSheet(true)}
            className="w-40 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              สถานะ
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className={`text-sm ${selectedStatus ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedStatus || 'ทั้งหมด'}
              </Text>
              <Text className="text-gray-400">▼</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="w-20 flex-row items-center justify-center rounded-xl bg-blue-500 py-4 shadow-sm">
            <Text className="mr-1 text-base text-white">🔍</Text>
            <Text className="text-xs font-semibold uppercase tracking-wide text-white">ค้นหา</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List Component */}
      <View className="rounded-2xl border border-gray-100 bg-white shadow-md">
        <View className="border-b border-gray-100 px-6 py-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-900">รายการตรวจสอบล่าสุด</Text>
              <Text className="text-sm text-gray-500">บันทึกการยืนยันตัวตนย้อนหลัง</Text>
            </View>
            <Text className="text-xs uppercase tracking-wide text-gray-400">อัปเดตทุก 5 นาที</Text>
          </View>

          {/* Search Results Summary */}
          {(searchName || selectedStatus || startDate || endDate) && (
            <View className="mb-3 rounded-xl bg-blue-50 px-4 py-3">
              <Text className="text-sm text-blue-700">
                {filteredRecords.length} จาก {verificationRecords.length} รายการ
                {searchName && ` • ค้นหา: ${searchName}`}
                {selectedStatus && ` • สถานะ: ${selectedStatus}`}
                {startDate && ` • จาก: ${formatDate(startDate)}`}
                {endDate && ` • ถึง: ${formatDate(endDate)}`}
              </Text>
            </View>
          )}

          {/* Header */}
          <View className="flex-row rounded-lg bg-gray-50 px-4 py-3">
            <Text className="flex-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Transaction
            </Text>
            <Text className="w-28 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Date
            </Text>
            <Text className="w-20 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              สถานะ
            </Text>
          </View>
        </View>

        <ScrollView className="max-h-64 px-2">
          {filteredRecords.map((record, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center border-b border-gray-100 px-4 py-4">
              <View className="flex-1">
                <Text className="mb-1 font-semibold text-gray-900">{record.id}</Text>
                <Text className="mb-1 text-sm text-gray-600">
                  {record.firstName} {record.lastName}
                </Text>
                <Text className="text-xs uppercase tracking-wide text-gray-400">{record.type}</Text>
              </View>

              <View className="w-28">
                <Text className="text-sm text-gray-600">{record.date}</Text>
              </View>

              <View className="w-20 items-end">
                <View className="rounded-full bg-gray-100 px-3 py-1">
                  <Text className={`text-xs font-semibold ${getStatusColor(record.status)}`}>
                    {record.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* No Results Message */}
          {filteredRecords.length === 0 && (
            <View className="items-center p-8">
              <Text className="text-center text-gray-500">ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity className="flex-row items-center justify-center border-t border-gray-100 py-4">
          <Text className="mr-2 text-sm font-medium text-blue-500">ดูทั้งหมด</Text>
          <Text className="text-blue-500">→</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers (CrossPlatform) */}
      <CrossPlatformDatePicker
        isVisible={showStartDatePicker}
        date={startDate || new Date()}
        mode="date"
        title="เลือกวันเริ่มต้น"
        confirmText="ตกลง"
        cancelText="ยกเลิก"
        onConfirm={(date) => {
          setStartDate(date);
          setShowStartDatePicker(false);
        }}
        onCancel={() => setShowStartDatePicker(false)}
      />

      <CrossPlatformDatePicker
        isVisible={showEndDatePicker}
        date={endDate || new Date()}
        mode="date"
        title="เลือกวันสิ้นสุด"
        confirmText="ตกลง"
        cancelText="ยกเลิก"
        onConfirm={(date) => {
          setEndDate(date);
          setShowEndDatePicker(false);
        }}
        onCancel={() => setShowEndDatePicker(false)}
      />

      {/* Status Selection Bottom Sheet */}
      <SearchBottomSheet
        isVisible={showSearchBottomSheet}
        onClose={() => setShowSearchBottomSheet(false)}
        onStatusSelect={handleStatusSelect}
        selectedStatus={selectedStatus}
      />
    </View>
  );
}
