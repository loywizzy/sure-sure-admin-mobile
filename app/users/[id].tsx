import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../lib/services/userService';
import { packageService } from '../../lib/services/packageService';
import { branchService } from '../../lib/services/branchService';
import { transactionService } from '../../lib/services/transactionService';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { data: user } = useQuery({ queryKey: ['users', id], queryFn: async () => (id ? await userService.fetchUserByUid(String(id)) : undefined), enabled: Boolean(id) });
  const { data: branches = [] } = useQuery({ queryKey: ['branches'], queryFn: branchService.fetchBranches });
  const { data: txns = [] } = useQuery({ queryKey: ['transactions'], queryFn: transactionService.fetchTransactions });
  const { data: pkg } = useQuery({
    queryKey: ['packages', user?.packageCode],
    queryFn: async () => {
      if (!user?.packageCode) return undefined;
      const numId = Number(user.packageCode);
      return await packageService.fetchPackageById(Number.isNaN(numId) ? user.packageCode : numId);
    },
    enabled: Boolean(user?.packageCode),
  });

  const handleMenuPress = () => setIsSidebarVisible(true);
  const handleSidebarClose = () => setIsSidebarVisible(false);

  // Derive related data
  const customerFullName = useMemo(() => (user ? [user.firstName, user.lastName].filter(Boolean).join(' ').trim() : ''), [user]);
  const relatedBranches = useMemo(() => {
    if (!user) return [] as typeof branches;
    return branches.filter((b) => b.code === user.code || b.customerName === customerFullName);
  }, [branches, user, customerFullName]);
  const relatedTxns = useMemo(() => {
    if (!user) return [] as typeof txns;
    const uId = user.id;
    const shortCode = user.code;
    const nameL = customerFullName.toLowerCase();
    return txns
      .filter((t) => t.customerNo === uId || t.customerNo === shortCode || `${t.firstName} ${t.lastName}`.trim().toLowerCase() === nameL)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [txns, user, customerFullName]);

  const kpis = useMemo(() => {
    const total = relatedTxns.length;
    const success = relatedTxns.filter((t) => t.status === 'TRANSACTION_SUCCESS').length;
    const failed = total - success;
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();
    let thisSum = 0;
    let lastSum = 0;
    for (const t of relatedTxns) {
      const d = new Date(t.createdAt);
      const amt = typeof t.amount === 'number' ? t.amount : 0;
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) thisSum += amt;
      else if (d.getFullYear() === lastYear && d.getMonth() === lastMonth) lastSum += amt;
    }
    const diff = thisSum - lastSum;
    return { total, success, failed, thisSum: Math.round(thisSum), lastSum: Math.round(lastSum), diff, diffUp: diff >= 0 };
  }, [relatedTxns]);

  if (!user) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-950">
        <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
        <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">ไม่พบผู้ใช้</Text>
        </View>
      </View>
    );
  }
  const u = user!;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <Navbar onMenuPress={handleMenuPress} title="รายชื่อผู้ใช้" />
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      <ScrollView className="flex-1 px-4 pt-3">
        {/* Header Card */}
        <View className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6" style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }}>
          <Text className="mb-2 font-mono text-base tracking-widest text-gray-900 dark:text-gray-100">{u.id} <Text className={u.active ? 'text-green-600' : 'text-red-500'}>({u.active ? 'Active' : 'Inactive'})</Text></Text>
          <Text className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100">{u.firstName}{u.lastName ? ` ${u.lastName}` : ''}</Text>

          <View className="mb-5">
            <Text className="text-base text-gray-700 dark:text-gray-300">อีเมล: {u.email}</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">ประเภท: {u.role}</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">แพ็คเกจสมัคร: {u.packageCode}</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">จำนวนที่ใช้ไป: {u.usedCount}</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">คงเหลือใช้งาน: {u.remaining}</Text>
            <Text className="text-base text-gray-700 dark:text-gray-300">วันหมดอายุ: {new Date(u.expiresAt).toLocaleDateString('th-TH')}</Text>
          </View>

          <View className="flex-row justify-start">
            <TouchableOpacity className="mr-3 rounded-full bg-red-500 px-6 py-2" onPress={() => router.replace('/users')}>
              <Text className="text-white">ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full bg-blue-600 px-6 py-2" onPress={() => router.push({ pathname: '/users/edit', params: { id: u.uid || u.id } })}>
              <Text className="text-white">แก้ไข</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KPI Row */}
        <View className="mt-4 mb-4 flex-row">
          <View className="mr-1 flex-1">
            <View className="rounded-2xl border-0 bg-white dark:bg-gray-900 p-4 shadow">
              <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">ธุรกรรมทั้งหมด</Text>
              <Text className="text-2xl font-black text-gray-900 dark:text-gray-100">{kpis.total}</Text>
            </View>
          </View>
          <View className="mx-1 flex-1">
            <View className="rounded-2xl border-0 bg-white dark:bg-gray-900 p-4 shadow">
              <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">สำเร็จ</Text>
              <Text className="text-2xl font-black text-emerald-600">{kpis.success}</Text>
            </View>
          </View>
          <View className="ml-1 flex-1">
            <View className="rounded-2xl border-0 bg-white dark:bg-gray-900 p-4 shadow">
              <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">ไม่สำเร็จ</Text>
              <Text className="text-2xl font-black text-rose-600">{kpis.failed}</Text>
            </View>
          </View>
        </View>

        {/* Package Card */}
        <View className="mb-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <Text className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">แพ็คเกจปัจจุบัน</Text>
          {pkg ? (
            <View className="flex-row justify-between">
              <View>
                <Text className="text-gray-700 dark:text-gray-300">ชื่อ: {pkg.name}</Text>
                <Text className="text-gray-700 dark:text-gray-300">โควต้าสูงสุด: {pkg.maxQuota.toLocaleString()}</Text>
                <Text className="text-gray-700 dark:text-gray-300">คงเหลือ: {u.remaining.toLocaleString()}</Text>
              </View>
              <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{pkg.price.toLocaleString('th-TH', { minimumFractionDigits: 0 })}฿</Text>
            </View>
          ) : (
            <Text className="text-gray-500 dark:text-gray-400">ไม่พบข้อมูลแพ็คเกจ</Text>
          )}
        </View>

        {/* Branches List */}
        <View className="mb-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">สาขาที่เกี่ยวข้อง</Text>
            <Text className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{relatedBranches.length} สาขา</Text>
          </View>
          {relatedBranches.length === 0 ? (
            <Text className="text-gray-500 dark:text-gray-400">ไม่มีสาขา</Text>
          ) : (
            relatedBranches.map((b) => (
              <View key={b.id} className="mb-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">{b.roomName}</Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">รหัส {b.code}</Text>
                </View>
                <View className="mt-1 flex-row justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-300">ใช้โควต้า: {b.usedQuota.toLocaleString()}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-300">ขั้นต่ำรับ: {b.minReceived.toFixed(2)}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Recent Transactions */}
        <View className="mb-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">ธุรกรรมล่าสุด</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/transactions', params: { customer: u.id } })}>
              <Text className="text-sm font-medium text-blue-600">ดูทั้งหมด →</Text>
            </TouchableOpacity>
          </View>
          {relatedTxns.length === 0 ? (
            <Text className="text-gray-500 dark:text-gray-400">ยังไม่มีธุรกรรม</Text>
          ) : (
            relatedTxns.map((t) => (
              <View key={t.id} className="mb-2 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">#{t.id}</Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.createdAt).toLocaleString('th-TH')}</Text>
                </View>
                <View className="mt-1 flex-row items-center justify-between">
                  <Text className="text-sm text-gray-700 dark:text-gray-300">{t.bank} · {t.transferId}</Text>
                  <Text className={`text-sm font-semibold ${t.status === 'TRANSACTION_SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>{t.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}


