import '@expo/metro-runtime';
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import WeekBottomSheet from '../features/dashboard/components/WeekBottomSheet';
import { useWeekStore } from '../lib/store';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../features/dashboard/components/StatsCard';
import LineChart from '../features/dashboard/components/LineChart';
import PieChart from '../features/dashboard/components/PieChart';
import TransactionList from '../features/dashboard/components/TransactionList';
import CustomerList from '../features/dashboard/components/CustomerList';

export default function Index() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const { weekStartISO, shiftWeeks, setWeekStart } = useWeekStore();
  const [showWeekPicker, setShowWeekPicker] = useState(false);

  const weekStart = new Date(weekStartISO);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekLabel = `${weekStart.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}–${weekEnd.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
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
              mainValue="150,000฿"
              subItems={[
                { label: 'รายได้เดือนที่แล้ว', value: '15,000฿', color: 'red' },
                { label: 'น้อยกว่าเดือนที่แล้ว', value: '10,000฾', color: 'red' },
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
                mainValue="10"
                subItems={[
                  { label: 'ถูกต้อง', value: '7', color: 'green' },
                  { label: 'ถูกปฏิเสธ', value: '3', color: 'red' },
                ]}
                icon="✅"
                iconBgColor="bg-gradient-to-r from-blue-500 to-blue-600"
                isMiniCard={true}
              />
            </View>
            <View className="mx-1 flex-1">
              <StatsCard
                title="แพ็คเกจ"
                mainValue="10"
                subItems={[
                  { label: 'กำลังใช้งาน', value: '7', color: 'green' },
                  { label: 'ไม่ได้ใช้งานแล้ว', value: '3', color: 'red' },
                ]}
                icon="📦"
                iconBgColor="bg-gradient-to-r from-purple-500 to-purple-600"
                isMiniCard={true}
              />
            </View>
            <View className="ml-1 flex-1">
              <StatsCard
                title="ลูกค้า"
                mainValue="10"
                subItems={[
                  { label: 'กำลังใช้งาน', value: '7', color: 'green' },
                  { label: 'ไม่ได้ใช้งานแล้ว', value: '3', color: 'red' },
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
            className="rounded-xl border border-gray-50 bg-white p-5 shadow-xl"
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
                <Text className="text-lg font-bold text-gray-800">ยอดการใช้งานแบบรายวัน</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity className="mr-2 rounded-lg bg-gray-50 px-3 py-2" onPress={() => shiftWeeks(-1)}>
                  <Text className="text-gray-600">‹</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-lg bg-gray-50 px-3 py-2" onPress={() => setShowWeekPicker(true)}>
                  <Text className="mr-1 text-sm text-gray-600">{weekLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="ml-2 rounded-lg bg-gray-50 px-3 py-2" onPress={() => shiftWeeks(1)}>
                  <Text className="text-gray-600">›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Professional Bar Chart */}
            <BarChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: [25, 42, 67, 18, 78, 99, 35],
                  },
                ],
              }}
              width={screenWidth - 32 - 40} // screenWidth - padding - card padding
              height={200}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#f8fafc',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7,
                fillShadowGradientFrom: '#3b82f6',
                fillShadowGradientFromOpacity: 0.8,
                fillShadowGradientTo: '#1d4ed8',
                fillShadowGradientToOpacity: 0.9,
              }}
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

        {/* Line Chart */}
        <View className="px-4">
          <LineChart />
        </View>

        {/* Pie Chart */}
        <View className="px-4">
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
