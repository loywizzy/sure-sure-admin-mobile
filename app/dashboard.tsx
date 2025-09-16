import { useRouter } from 'expo-router';
import { Text, View, Pressable } from 'react-native';

export default function Dashboard() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold mb-2">Dashboard</Text>
      <Text className="text-gray-600 mb-6">Your quick stats and actions go here.</Text>

      <View className="flex-row gap-3">
        <View className="bg-gray-100 rounded-lg px-4 py-3 mr-2">
          <Text className="font-semibold">Orders</Text>
          <Text className="text-lg">12</Text>
        </View>
        <View className="bg-gray-100 rounded-lg px-4 py-3">
          <Text className="font-semibold">Revenue</Text>
          <Text className="text-lg">$1,240</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace('/')}
        className="mt-8 bg-gray-800 px-4 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Back to Home</Text>
      </Pressable>
    </View>
  );
}
