import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#0D1F4E' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="university-select" options={{ title: 'Select University' }} />
      <Stack.Screen name="verify-id" options={{ title: 'Student ID Verification' }} />
    </Stack>
  );
}
