import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { RideProvider } from '@/context/ride-context';
import { AuthProvider } from '@/context/auth-context';
import { RiderAdminProvider } from '@/context/rider-admin-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RiderAdminProvider>
        <RideProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </RideProvider>
      </RiderAdminProvider>
    </AuthProvider>
  );
}
