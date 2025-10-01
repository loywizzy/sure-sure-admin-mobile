import { Stack, usePathname, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import i18n from '../lib/i18n';
import { useEffect } from 'react';
import { useAuthStore, useUiStore } from '../lib/store';
import { subscribeDashboard } from '../lib/realtime';

// Import global styles (e.g., NativeWind)
import '../global.css';

export default function RootLayout() {
  const { locale, initialize } = useUiStore();
  const { initialize: initAuth, isAuthenticated, initialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    initialize();
    initAuth();
  }, [initialize, initAuth]);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  // Global auth guard
  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    } else if (isAuthenticated && pathname === '/login') {
      router.replace('/');
    }
  }, [initialized, isAuthenticated, pathname, router]);

  // Apply theme to NativeWind when UI store is ready
  useEffect(() => {
    if (!initialized) return;
    const unsub = useUiStore.subscribe((s) => {
      setColorScheme(s.theme);
    });
    // set once on mount
    setColorScheme(useUiStore.getState().theme);
    return () => {
      unsub();
    };
  }, [initialized, setColorScheme]);

  // Realtime for dashboard only
  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) return;
    const sub = subscribeDashboard();
    return () => {
      sub.disconnect();
    };
  }, [initialized, isAuthenticated]);
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
