import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#0D1F4E' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'CampusRide' }} />
      <Stack.Screen name="location-picker" options={{ title: 'Select Route' }} />
      <Stack.Screen name="live-tracking" options={{ title: 'Live Ride Tracking' }} />
      <Stack.Screen name="trip-receipt" options={{ title: 'Trip Receipt' }} />
      <Stack.Screen name="feedback" options={{ title: 'Incident & Ratings' }} />
    </Stack>
  );
}
