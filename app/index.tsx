import { Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';

export default function Index() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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
        {/* Stats Cards Row 1 */}
        <View className="flex-row px-4 pt-4 mb-3">
          <View className="flex-1 mr-2">
            <StatsCard
              title="รายได้รอบวันนี้"
              mainValue="150,000฿"
              subValue="15,000฿ บัดเครดิต | 10,000฿ แคช"
              changeValue="7 ↗ 3"
              changeType="increase"
              icon="💰"
              iconBgColor="bg-blue-500"
            />
          </View>
          <View className="flex-1 ml-2">
            <StatsCard
              title="รายการรอจัดส่อง"
              mainValue="10"
              subValue="อนุมัติ"
              changeValue="7 ↗ 3"
              changeType="increase"
              icon="✅"
              iconBgColor="bg-blue-500"
            />
          </View>
        </View>

        {/* Stats Cards Row 2 */}
        <View className="flex-row px-4 mb-4">
          <View className="flex-1 mr-2">
            <StatsCard
              title="แพ็คเกจ"
              mainValue="10"
              subValue="กำลังดำเนิน | โปรโมชั่นเพิ่มใหม่"
              changeValue="7 ↗ 3"
              changeType="increase"
              icon="📦"
              iconBgColor="bg-blue-500"
            />
          </View>
          <View className="flex-1 ml-2">
            <StatsCard
              title="ลูกค้า"
              mainValue="10"
              subValue="กำลังดำเนิน | โปรโมชั่นเพิ่มใหม่"
              changeValue="7 ↗ 3"
              changeType="increase"
              icon="👥"
              iconBgColor="bg-blue-500"
            />
          </View>
        </View>

        {/* Chart Section */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">📊 ยอดการใช้งานแบบรายวัน</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-1">
                <Text className="text-sm text-gray-600 mr-1">This Week</Text>
                <Text className="text-gray-400">▼</Text>
              </View>
            </View>
            
            {/* Simple Chart Representation */}
            <View className="flex-row items-end justify-between h-32 px-2">
              {[20, 40, 60, 15, 80, 45, 95, 30].map((height, index) => (
                <View key={index} className="flex-1 items-center mx-1">
                  <View 
                    className="bg-blue-500 w-full rounded-t-sm" 
                    style={{ height: `${height}%` }}
                  />
                  {index === 6 && (
                    <View className="absolute -top-6 bg-blue-500 rounded px-2 py-1">
                      <Text className="text-white text-xs font-medium">99</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
            
            {/* Chart Navigation */}
            <View className="flex-row justify-center mt-4">
              <View className="flex-row bg-gray-800 rounded-lg p-1">
                <Text className="text-white px-2 py-1 text-sm">←</Text>
                <Text className="text-white px-2 py-1 text-sm">→</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

