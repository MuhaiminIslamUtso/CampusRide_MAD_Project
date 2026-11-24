import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#0D9488',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#E2E8F0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Ride',
                    tabBarIcon: (props) => (
                        <Ionicons name="navigate-outline" size={props.size} color={(props.color as any) || '#0D9488'} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: (props) => (
                        <Ionicons name="time-outline" size={props.size} color={(props.color as any) || '#94A3B8'} />
                    ),
                }}
            />
        </Tabs>
    );
}
