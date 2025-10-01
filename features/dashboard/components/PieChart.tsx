import React, { useMemo, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import PieChartMonthSheet from './PieChartMonthSheet';
import { useQuery } from '@tanstack/react-query';
import { transactionService, fetchTransactionsRaw } from '../../../lib/services/transactionService';
import { orderPackageService } from '../../../lib/services/orderPackageService';

export default function PieChartComponent() {
  const screenWidth = Dimensions.get('window').width;
  const [pickerVisible, setPickerVisible] = useState(false);
  const now = new Date();
  const [selected, setSelected] = useState({ monthIndex: now.getMonth(), year: now.getFullYear() });
  // ดึงข้อมูลดิบ
  const { data: txns = [] } = useQuery({ queryKey: ['transactions'], queryFn: transactionService.fetchTransactions });
  const { data: txnsRaw = [] } = useQuery({ queryKey: ['transactions-raw'], queryFn: fetchTransactionsRaw });
  const { data: orders = [] } = useQuery({ queryKey: ['order-packages'], queryFn: orderPackageService.fetchOrderPackages });

  // ตัวอย่างสถิติโดยรวมแบบรายเดือนตามหัวข้อ (ปรับจากข้อมูลจริงที่มี):
  // - ลูกค้าใหม่: ยังไม่มี endpoint ผู้ใช้ใหม่รายเดือน → ใช้จำนวนออเดอร์แพ็คเกจ SUCCESS ในเดือนแทน (proxy metric)
  // - เลขบัญชีไม่ตรงกับผู้รับ: ใช้ธุรกรรมสถานะ RECEIVER NOT MATCH ในเดือน
  // - สลิปที่ถูกต้อง: ธุรกรรมสถานะ SUCCESS ในเดือนนั้น
  // - จำนวนเงินน้อยกว่าขั้นต่ำ: ใช้ธุรกรรมสถานะ AMOUNT LESS THAN MINIMUM ในเดือน
  // - สลิปที่มีข้อผิดพลาด: ธุรกรรมที่ไม่ SUCCESS ในเดือนนั้น
  // - เก็บข้อมูลพลาด: ธุรกรรมที่ไม่มี txid/ref_no ทั้งคู่ (ข้อมูลไม่ครบ)
  const monthStats = useMemo(() => {
    const { monthIndex, year } = selected;
    const isSameMonth = (iso: string) => {
      const d = new Date(iso);
      return d.getFullYear() === year && d.getMonth() === monthIndex;
    };

    // ลูกค้าใหม่ (proxy: ออเดอร์แพ็คเกจ SUCCESS ในเดือน)
    const newCustomers = orders.filter((o) => o.status === 'SUCCESS' && isSameMonth(o.created_date)).length;

    // สลิปที่ถูกต้อง (ธุรกรรม SUCCESS)
    const txSuccess = txns.filter((t) => isSameMonth(t.createdAt) && t.status === 'TRANSACTION SUCCESSFUL').length;

    // ข้อผิดพลาด (ธุรกรรมไม่ SUCCESS)
    const txError = txns.length > 0
      ? txns.filter((t) => isSameMonth(t.createdAt) && t.status !== 'TRANSACTION SUCCESSFUL').length
      : 0;

    // เลขบัญชีไม่ตรงกับผู้รับ
    const receiverNotMatch = txns.filter((t) => isSameMonth(t.createdAt) && t.status === 'RECEIVER NOT MATCH').length;

    // จำนวนเงินน้อยกว่าขั้นต่ำ
    const amountLessThanMinimum = txns.filter((t) => isSameMonth(t.createdAt) && t.status === 'AMOUNT LESS THAN MINIMUM').length;

    // เก็บข้อมูลพลาด (ไม่มี txid/ref_no)
    const missingInfo = txnsRaw.filter((t) => {
      if (!isSameMonth(t.created_date || (t.trans_date && t.trans_time ? `${t.trans_date}T${t.trans_time}Z` : ''))) return false;
      return !(t.txid || t.ref_no);
    }).length;

    return { newCustomers, receiverNotMatch, txSuccess, amountLessThanMinimum, txError, missingInfo };
  }, [selected, txns, txnsRaw, orders]);

  const data = useMemo(() => [
    { name: 'ลูกค้าใหม่', population: monthStats.newCustomers, color: '#3b82f6', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'เลขบัญชีไม่ตรงกับผู้รับ', population: monthStats.receiverNotMatch, color: '#eab308', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'สลิปที่ถูกต้อง', population: monthStats.txSuccess, color: '#22c55e', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'จำนวนเงินน้อยกว่าขั้นต่ำ', population: monthStats.amountLessThanMinimum, color: '#059669', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'สลิปที่มีข้อผิดพลาด', population: monthStats.txError, color: '#ec4899', legendFontColor: '#374151', legendFontSize: 12 },
    { name: 'เก็บข้อมูลพลาด', population: monthStats.missingInfo, color: '#6b7280', legendFontColor: '#374151', legendFontSize: 12 },
  ], [monthStats]);

  const monthLabel = useMemo(() => {
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    return `${months[selected.monthIndex]} ${selected.year}`;
  }, [selected]);

  return (
    <View
      className="mb-4 rounded-xl border border-gray-50 bg-white p-4 shadow-xl"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-800">สถิติโดยรวมแบบรายเดือน</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-3 flex-row items-center rounded-lg bg-gray-50 px-3 py-2" onPress={() => setPickerVisible(true)}>
            <Text className="mr-1 text-sm text-gray-600">{monthLabel}</Text>
            <Text className="text-gray-400">▼</Text>
          </TouchableOpacity>
          <Text className="font-bold text-blue-500">↗ 98%</Text>
        </View>
      </View>

      <PieChart
        data={data}
        width={screenWidth - 32 - 32} // screenWidth - padding
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f8fafc',
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        center={[10, 0]}
        absolute={true}
        hasLegend={true}
        style={{
          borderRadius: 16,
        }}
      />
      <PieChartMonthSheet
        isVisible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        value={selected}
        onSelect={(monthIndex, year) => {
          setSelected({ monthIndex, year });
          setPickerVisible(false);
        }}
      />
    </View>
  );
}
