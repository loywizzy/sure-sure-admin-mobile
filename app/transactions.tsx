import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

type Txn = {
  id: string;
  customerNo: string;
  bank: string;
  errorMsg?: string;
  transferId: string;
  status: 'TRANSACTION SUCCESSFUL' | 'TRANSACTION UNSUCCESSFUL' | 'RECEIVER NOT MATCH' | 'AMOUNT LESS THAN MINIMUM' | 'ERROR';
};

export default function TransactionsScreen() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const txns: Txn[] = useMemo(
    () => [
      {
        id: '000001',
        customerNo: '59',
        bank: 'KBank',
        transferId: '#88201',
        status: 'TRANSACTION SUCCESSFUL',
      },
      {
        id: '000002',
        customerNo: '59',
        bank: 'KBank',
        errorMsg: 'Amount < Minimum',
        transferId: '#88201',
        status: 'AMOUNT LESS THAN MINIMUM',
      },
    ],
    []
  );

  const list = useMemo(() => {
    if (!statusFilter) return txns;
    return txns.filter((t) => t.status === statusFilter);
  }, [txns, statusFilter]);

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

  const renderCard = (t: Txn, idx: number) => {
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
        <Text className="mb-2 text-lg font-extrabold tracking-wider text-gray-900">{t.id}</Text>
        <Text className="text-sm text-gray-700">| เลขรายการ: TX-0001234</Text>
        <Text className="text-sm text-gray-700">| รหัสลูกค้า: {t.customerNo}</Text>
        <Text className="text-sm text-gray-700">| ชื่อลูกค้า: TATAR</Text>
        <Text className="text-sm text-gray-700">| ธนาคาร: {t.bank}</Text>
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

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar onMenuPress={handleMenuPress} title="รายงานธุรกรรม" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        {/* Filters row: status shortcuts */}
        <View className="mb-4 flex-row flex-wrap gap-2">
          {[
            'TRANSACTION SUCCESSFUL',
            'TRANSACTION UNSUCCESSFUL',
            'RECEIVER NOT MATCH',
            'AMOUNT LESS THAN MINIMUM',
            'ERROR',
          ].map((s) => (
            <TouchableOpacity key={s} onPress={() => setStatusFilter(s)} activeOpacity={0.8}>
              <StatusPill label={s} tone={s === 'TRANSACTION SUCCESSFUL' ? 'success' : 'danger'} />
            </TouchableOpacity>
          ))}
          {statusFilter !== '' && (
            <TouchableOpacity onPress={() => setStatusFilter('')} activeOpacity={0.8}>
              <View className="rounded-full border border-gray-300 bg-white px-4 py-2">
                <Text className="text-xs font-semibold text-gray-600">ล้างตัวกรอง</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {list.map(renderCard)}
      </ScrollView>
    </View>
  );
}


