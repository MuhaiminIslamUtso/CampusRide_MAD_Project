import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#0D1F4E' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Rider Dashboard' }} />
      <Stack.Screen name="vehicle-register" options={{ title: 'Vehicle Registration' }} />
    </Stack>
  );
}
