import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import SearchBottomSheet from './TransactionBottomSheet';
import CrossPlatformDatePicker from '../../../components/ui/CrossPlatformDatePicker';

interface VerificationRecord {
  id: string;
  date: string;
  firstName: string;
  lastName: string;
  status: 'สำเร็จ' | 'ไม่สำเร็จ' | 'รอตรวจสอบ' | 'บัญชีผู้รับไม่ตรง' | 'จำนวนเงินน้อยกว่าขั้นต่ำ'| 'ไม่สามารถตรวจสอบได้' ;
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
        status: 'สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 23, 2021',
        firstName: 'สมหญิง',
        lastName: 'รักดี',
        status: 'ไม่สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 18, 2021',
        firstName: 'วิทยา',
        lastName: 'เก่งมาก',
        status: 'ไม่สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 15, 2021',
        firstName: 'มานะ',
        lastName: 'ขยันดี',
        status: 'บัญชีผู้รับไม่ตรง',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 15, 2021',
        firstName: 'ประสิทธิ์',
        lastName: 'รวยมาก',
        status: 'สำเร็จ',
      },
      {
        id: 'TXN2948239489230',
        date: 'Apr 11, 2021',
        firstName: 'วิชัย',
        lastName: 'สบายใจ',
        status: 'จำนวนเงินน้อยกว่าขั้นต่ำ',
      },
      {
        id: 'TXN2948239489430',
        date: 'Apr 11, 2021',
        firstName: 'วิชัย',
        lastName: 'สบายใจ',
        status: 'จำนวนเงินน้อยกว่าขั้นต่ำ',
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

  const formatTxnForDisplay = (txnId: string): string => {
    if (!txnId) return '';
    if (txnId.length <= 3) return txnId;
    const head = txnId.slice(0, -3);
    const tail = txnId.slice(-3);
    return `${head}\n${tail}`;
  };

  return (
    <View className="mb-4">
      {/* Search Section - Outside Component */}
      <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
        {/* Row 1: Start + End date pills and clear */}
        <View className="mb-3 flex-row items-center">
          {/* Start date */}
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            className="flex-1 flex-row items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-4 py-2 mr-3">
            <Text className={`text-sm ${startDate ? 'text-gray-800' : 'text-gray-400'}`}>
              {startDate ? formatDate(startDate) : 'วันเริ่มต้น'}
            </Text>
            <Text className="text-gray-500">📅</Text>
          </TouchableOpacity>
          {/* End date */}
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            className="flex-1 flex-row items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <Text className={`text-sm ${endDate ? 'text-gray-800' : 'text-gray-400'}`}>
              {endDate ? formatDate(endDate) : 'วันสิ้นสุด'}
            </Text>
            <Text className="text-gray-500">📅</Text>
          </TouchableOpacity>
          {/* Clear */}
          <TouchableOpacity
            onPress={clearSearch}
            className="ml-3 h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white">
            <Text className="text-base text-red-500">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Name input + Status dropdown */}
        <View className="flex-row items-center">
          <View className="mr-3 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <TextInput
              value={searchName}
              onChangeText={setSearchName}
              placeholder="ชื่อ-นามสกุล"
              placeholderTextColor="#9ca3af"
              className="text-sm text-gray-800"
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowSearchBottomSheet(true)}
            className="w-40 flex-row items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <Text className={`text-sm ${selectedStatus ? 'text-gray-900' : 'text-gray-400'}`}>
              {selectedStatus || 'ทั้งหมด'}
            </Text>
            <Text className="text-gray-500">▾</Text>
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
          <View className="flex-row rounded-xl bg-gray-100 px-4 py-3">
            <Text className="flex-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Transaction
            </Text>
            <Text className="w-32 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Date
            </Text>
            <Text className="w-20 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              สถานะ
            </Text>
          </View>
        </View>

        <ScrollView className="max-h-96 px-2">
          {filteredRecords.map((record, index) => (
            <View key={index} className="mb-3 rounded-xl bg-gray-50 px-4 py-4">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="whitespace-pre-line text-sm font-semibold text-gray-900">
                    {formatTxnForDisplay(record.id)}
                  </Text>
                </View>
                <View className="w-32">
                  <Text className="text-sm text-gray-600">{record.date}</Text>
                </View>
                <View className="w-20 items-end">
                  <Text className={`text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </Text>
                </View>
              </View>
            </View>
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
