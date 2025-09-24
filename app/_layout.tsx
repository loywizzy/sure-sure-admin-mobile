import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import i18n from '../lib/i18n';
import { useEffect } from 'react';
import { useAuthStore, useUiStore } from '../lib/store';

// Import global styles (e.g., NativeWind)
import '../global.css';

export default function RootLayout() {
  const { locale, initialize } = useUiStore();
  const { initialize: initAuth } = useAuthStore();

  useEffect(() => {
    initialize();
    initAuth();
  }, [initialize, initAuth]);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="dark" backgroundColor="#ffffff" />
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
