import '@expo/metro-runtime';
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useMemo, useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import WeekBottomSheet from '../features/dashboard/components/WeekBottomSheet';
import { useWeekStore, useUiStore } from '../lib/store';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../features/dashboard/components/StatsCard';
// Removed LineChart in favor of MonthlyRevenueCard
import PieChart from '../features/dashboard/components/PieChart';
import TransactionList from '../features/dashboard/components/TransactionList';
import CustomerList from '../features/dashboard/components/CustomerList';
import MonthlyRevenueCard from '../features/dashboard/components/MonthlyRevenueCard';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../lib/services/transactionService';
import { packageService } from '../lib/services/packageService';
import { userService } from '../lib/services/userService';

export default function Index() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const { weekStartISO, shiftWeeks, setWeekStart } = useWeekStore();
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const { theme } = useUiStore();
  const isDark = theme === 'dark';

  const weekStart = useMemo(() => new Date(weekStartISO), [weekStartISO]);
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d;
  }, [weekStart]);
  const weekLabel = `${weekStart.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}–${weekEnd.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  // รายได้เดือนนี้/เดือนที่แล้ว จาก transaction.amount
  const { data: txns = [] } = useQuery({ queryKey: ['transactions'], queryFn: transactionService.fetchTransactions });
  const { data: pkgs = [] } = useQuery({ queryKey: ['packages'], queryFn: packageService.fetchPackages });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: userService.fetchUsers });
  const { thisMonthRevenue, lastMonthRevenue, diffLabel, diffIsUp } = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();

    let thisSum = 0;
    let lastSum = 0;
    for (const t of txns) {
      const d = new Date(t.createdAt);
      const amt = typeof t.amount === 'number' ? t.amount : 0;
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) thisSum += amt;
      else if (d.getFullYear() === lastYear && d.getMonth() === lastMonth) lastSum += amt;
    }
    const diff = thisSum - lastSum;
    const formattedDiff = new Intl.NumberFormat('th-TH').format(Math.abs(Math.round(diff)));
    return {
      thisMonthRevenue: Math.round(thisSum),
      lastMonthRevenue: Math.round(lastSum),
      diffLabel: `${formattedDiff}฿`,
      diffIsUp: diff >= 0,
    };
  }, [txns]);

  // ยอดการใช้งานรายวันจากธุรกรรมในสัปดาห์ที่เลือก
  const dailyCounts = useMemo(() => {
    const counts = Array(7).fill(0) as number[]; // Mon..Sun
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    end.setHours(23,59,59,999);
    for (const t of txns) {
      const d = new Date(t.createdAt);
      if (d >= start && d <= end) {
        const js = d.getDay();
        const idx = js === 0 ? 6 : js - 1;
        counts[idx] += 1;
      }
    }
    return counts;
  }, [txns, weekStart, weekEnd]);

  const barChartConfig = useMemo(() => ({
    backgroundColor: isDark ? '#111827' : '#ffffff',
    backgroundGradientFrom: isDark ? '#111827' : '#ffffff',
    backgroundGradientTo: isDark ? '#0b1220' : '#f8fafc',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(156, 163, 175, ${opacity})` : `rgba(107, 114, 128, ${opacity})`,
    style: { borderRadius: 16 },
    barPercentage: 0.7,
    fillShadowGradientFrom: '#3b82f6',
    fillShadowGradientFromOpacity: 0.8,
    fillShadowGradientTo: '#1d4ed8',
    fillShadowGradientToOpacity: 0.9,
  }), [isDark]);

  // สรุปจำนวนรายการตรวจสอบจากธุรกรรม
  const checksSummary = useMemo(() => {
    const total = txns.length;
    const success = txns.filter((t) => t.status === 'TRANSACTION SUCCESSFUL').length;
    const failed = total - success;
    return { total, success, failed };
  }, [txns]);

  // สรุปแพ็คเกจทั้งหมด/ที่ active
  const pkgSummary = useMemo(() => {
    const total = pkgs.length;
    const active = pkgs.filter((p) => p.active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [pkgs]);

  // สรุปลูกค้า: ทั้งหมด/active/หมดอายุ
  const userSummary = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    const now = new Date();
    const expired = users.filter((u) => new Date(u.expiresAt) < now).length;
    return { total, active, expired };
  }, [users]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <Navbar onMenuPress={handleMenuPress} title="แดชบอร์ด" />

      {/* Sidebar Modal */}
      <Sidebar isVisible={isSidebarVisible} onClose={handleSidebarClose} />

      {/* Main Content */}
      <ScrollView className="flex-1">
        {/* Stats Cards - Hero Card + 3 Mini Layout */}
        <View className="px-4 pt-4">
          {/* Hero Card - รายได้เดือนนี้ */}
          <View className="mb-4">
            <StatsCard
              title="รายได้เดือนนี้"
              mainValue={new Intl.NumberFormat('th-TH').format(thisMonthRevenue) + '฿'}
              subItems={[
                { label: 'รายได้เดือนที่แล้ว', value: new Intl.NumberFormat('th-TH').format(lastMonthRevenue) + '฿', color: 'green' },
                { label: diffIsUp ? 'มากกว่าเดือนที่แล้ว' : 'น้อยกว่าเดือนที่แล้ว', value: diffLabel, color: diffIsUp ? 'green' : 'red' },
              ]}
              icon="💰"
              iconBgColor="bg-gradient-to-r from-emerald-500 to-emerald-600"
              isHeroCard={true}
            />
          </View>

          {/* 3 Mini Cards Row */}
          <View className="mb-4 flex-row">
            <View className="mr-1 flex-1">
              <StatsCard
                title="รายการตรวจสอบ"
                mainValue={String(checksSummary.total)}
                subItems={[
                  { label: 'ถูกต้อง', value: String(checksSummary.success), color: 'green' },
                  { label: 'ถูกปฏิเสธ', value: String(checksSummary.failed), color: 'red' },
                ]}
                icon="✅"
                iconBgColor="bg-gradient-to-r from-blue-500 to-blue-600"
                isMiniCard={true}
              />
            </View>
            <View className="mx-1 flex-1">
              <StatsCard
                title="แพ็คเกจ"
                mainValue={String(pkgSummary.total)}
                subItems={[
                  { label: 'กำลังใช้งาน', value: String(pkgSummary.active), color: 'green' },
                  { label: 'ไม่ได้ใช้งานแล้ว', value: String(pkgSummary.inactive), color: 'red' },
                ]}
                icon="📦"
                iconBgColor="bg-gradient-to-r from-purple-500 to-purple-600"
                isMiniCard={true}
              />
            </View>
            <View className="ml-1 flex-1">
              <StatsCard
                title="ลูกค้า"
                mainValue={String(userSummary.total)}
                subItems={[
                  { label: 'กำลังใช้งาน', value: String(userSummary.active), color: 'green' },
                  { label: 'หมดอายุ', value: String(userSummary.expired), color: 'red' },
                ]}
                icon="👥"
                iconBgColor="bg-gradient-to-r from-orange-500 to-orange-600"
                isMiniCard={true}
              />
            </View>
          </View>
        </View>

        {/* Bar Chart Section */}
        <View className="mb-4 px-4">
          <View
            className="rounded-xl border border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}>
            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-6 w-6">
                  <View className="mb-1 h-1 w-full rounded-full bg-blue-500" />
                  <View className="mb-1 h-2 w-full rounded-full bg-blue-500" />
                  <View className="h-1.5 w-full rounded-full bg-blue-500" />
                </View>
                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">ยอดการใช้งานแบบรายวัน</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity className="mr-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2" onPress={() => shiftWeeks(-1)}>
                  <Text className="text-gray-600 dark:text-gray-300">‹</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2" onPress={() => setShowWeekPicker(true)}>
                  <Text className="mr-1 text-sm text-gray-600 dark:text-gray-300">{weekLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="ml-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2" onPress={() => shiftWeeks(1)}>
                  <Text className="text-gray-600 dark:text-gray-300">›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Professional Bar Chart */}
            <BarChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{ data: dailyCounts }],
              }}
              width={screenWidth - 32 - 40} // screenWidth - padding - card padding
              height={200}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={barChartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              fromZero={true}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>

        {/* Monthly Revenue (แทน Line Chart เดิม) */}
        <View className="px-4 pt-2 mb-4">
          <MonthlyRevenueCard />
        </View>

        {/* Spacer or additional cards can go here */}

        {/* Pie Chart */}
        <View className="px-4 mb-4">
          <PieChart />
        </View>

        {/* Transaction List */}
        <View className="px-4">
          <TransactionList />
        </View>

        {/* Customer List */}
        <View className="px-4 pb-4">
          <CustomerList />
        </View>
      </ScrollView>
      <WeekBottomSheet
        isVisible={showWeekPicker}
        onClose={() => setShowWeekPicker(false)}
        onSelect={(iso) => {
          setWeekStart(iso);
          setShowWeekPicker(false);
        }}
        currentWeekISO={weekStartISO}
      />
    </View>
  );
}
