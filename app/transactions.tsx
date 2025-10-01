import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBottomSheet from '../features/dashboard/components/TransactionBottomSheet';
import CrossPlatformDatePicker from '../components/ui/CrossPlatformDatePicker';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../lib/services/transactionService';
import type { TransactionItem, TransactionStatus } from '../lib/types';

type Txn = TransactionItem;

export default function TransactionsScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showSearchBottomSheet, setShowSearchBottomSheet] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { data: txns = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: transactionService.fetchTransactions });

  type DisplayTxn = Omit<Txn, 'createdAt'> & { createdAt: Date };

  const list = useMemo(() => {
    let result: DisplayTxn[] = txns.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
    // Name filter (first + last)
    if (searchName) {
      const q = searchName.toLowerCase();
      result = result.filter((t) => `${t.firstName} ${t.lastName}`.toLowerCase().includes(q));
    }
    // Status filter: map Thai label from bottom sheet to our enum
    if (selectedStatus) {
      const thaiToEnglish: Record<string, TransactionStatus> = {
        'สำเร็จ': 'TRANSACTION SUCCESSFUL',
        'ไม่สำเร็จ': 'TRANSACTION UNSUCCESSFUL',
        'บัญชีผู้รับไม่ตรง': 'RECEIVER NOT MATCH',
        'จำนวนเงินน้อยกว่าขั้นต่ำ': 'AMOUNT LESS THAN MINIMUM',
        'ไม่สามารถตรวจสอบได้': 'ERROR',
      };
      const mapped = thaiToEnglish[selectedStatus];
      if (mapped) {
        result = result.filter((t) => t.status === mapped);
      }
    }
    // Date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter((t) => t.createdAt >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((t) => t.createdAt <= end);
    }
    return result;
  }, [txns, searchName, selectedStatus, startDate, endDate]);

  const StatusPill = ({ label, tone }: { label: string; tone: 'success' | 'danger' }) => (
    <View
      className={`rounded-full px-4 py-2 ${tone === 'success' ? 'bg-green-50' : 'bg-red-50'} border ${
        tone === 'success' ? 'border-green-200' : 'border-red-200'
      }`}
      style={{
        shadowColor: tone === 'success' ? '#22c55e' : '#ef4444',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
      }}>
      <Text className={`${tone === 'success' ? 'text-green-600' : 'text-red-600'} text-xs font-semibold`}>
        {label}
      </Text>
    </View>
  );

  const renderCard = (t: DisplayTxn, idx: number) => {
    const tone = t.status === 'TRANSACTION SUCCESSFUL' ? 'success' : 'danger';
    return (
      <View
        key={idx}
        className="mb-4 rounded-2xl border border-gray-200 bg-white p-4"
        style={{
          shadowColor: tone === 'success' ? '#22c55e' : '#ef4444',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        }}>
        <Text className="mb-2 text-lg font-extrabold tracking-wider text-gray-900">#{t.id}</Text>
        <Text className="text-sm text-gray-700">| รหัสลูกค้า: {t.customerNo}</Text>
        <Text className="text-sm text-gray-700">| ชื่อลูกค้า: {t.firstName} {t.lastName}</Text>
        <Text className="text-sm text-gray-700">| ธนาคาร: {t.bank}</Text>
        <Text className="text-sm text-gray-700">| วันที่ทำรายการ: {t.createdAt.toLocaleString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
        <Text className="text-sm text-gray-700">| ErrorMsg: {t.errorMsg ?? '-'}</Text>
        <Text className="mb-3 text-sm text-gray-700">| Transfer ID: {t.transferId}</Text>

        <StatusPill
          label={t.status}
          tone={t.status === 'TRANSACTION SUCCESSFUL' ? 'success' : 'danger'}
        />
      </View>
    );
  };

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);
  const handleStatusSelect = (status: string) => setSelectedStatus(status);
  const clearSearch = () => {
    setSearchName('');
    setSelectedStatus('');
    setStartDate(null);
    setEndDate(null);
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'เลือกวันที่';
    return date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="รายงานธุรกรรม" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        {isLoading && (
          <View className="mb-4 rounded-xl bg-white p-4">
            <Text className="text-gray-500">กำลังโหลด...</Text>
          </View>
        )}
        {/* Search Section - like Dashboard */}
        <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
          {/* Row 1: Start + End date pills and clear */}
          <View className="mb-3 flex-row items-center">
            {/* Start date */}
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              className="flex-1 flex-row items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-4 py-2 mr-3">
              <Text className={`text-sm ${startDate ? 'text-gray-800' : 'text-gray-400'}`}>{startDate ? formatDate(startDate) : 'วันเริ่มต้น'}</Text>
              <Text className="text-gray-500">📅</Text>
            </TouchableOpacity>
            {/* End date */}
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              className="flex-1 flex-row items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
              <Text className={`text-sm ${endDate ? 'text-gray-800' : 'text-gray-400'}`}>{endDate ? formatDate(endDate) : 'วันสิ้นสุด'}</Text>
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
              <Text className={`text-sm ${selectedStatus ? 'text-gray-900' : 'text-gray-400'}`}>{selectedStatus || 'ทั้งหมด'}</Text>
              <Text className="text-gray-500">▾</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results Summary */}
        {(searchName || selectedStatus || startDate || endDate) && (
          <View className="mb-4 rounded-xl bg-blue-50 px-4 py-3">
            <Text className="text-sm text-blue-700">
              {list.length} จาก {txns.length} รายการ
              {searchName && ` • ค้นหา: ${searchName}`}
              {selectedStatus && ` • สถานะ: ${selectedStatus}`}
              {startDate && ` • จาก: ${formatDate(startDate)}`}
              {endDate && ` • ถึง: ${formatDate(endDate)}`}
            </Text>
          </View>
        )}

        {list.map(renderCard)}
      </ScrollView>
      {/* Bottom Sheet: Status selection (same as Dashboard) */}
      <SearchBottomSheet
        isVisible={showSearchBottomSheet}
        onClose={() => setShowSearchBottomSheet(false)}
        onStatusSelect={handleStatusSelect}
        selectedStatus={selectedStatus}
      />

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
    </View>
  );
}


