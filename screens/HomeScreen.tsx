import { Text, View, Pressable } from 'react-native';
// Removed ScreenContent to hide the template banner

type Props = {
  onOpenDashboard: () => void;
};

export default function HomeScreen({ onOpenDashboard }: Props) {
  return (
    <>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500 mb-4">
          Welcome!
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenDashboard}
          className="bg-blue-600 px-4 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go to Dashboard</Text>
        </Pressable>
      </View>
    </>
  );
}
