import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Import global styles (e.g., NativeWind)
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}

