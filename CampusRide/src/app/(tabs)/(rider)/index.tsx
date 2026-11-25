import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiderAdmin } from '@/context/rider-admin-context';
import IncomingRequestModal, { IncomingRequestData } from '@/components/incoming-request-modal';

export default function RiderDashboardScreen() {
  const { state, toggleOnline } = useRiderAdmin();
  const [incomingReq, setIncomingReq] = useState<IncomingRequestData | null>(null);

  const simulateIncoming = () => {
    if (!state.isOnline) {
      Alert.alert('You are Offline', 'Turn on Rider Availability to receive campus ride requests.');
      return;
    }
    setIncomingReq({
      id: 'req-' + Date.now().toString().slice(-4),
      passengerName: 'Ayesha Rahman',
      passengerUni: 'AIUB',
      pickup: 'Kuratoli Railgate (Near Pharmacy)',
      destination: 'AIUB Building D Gate',
      fare: 50,
      distance: '2.1 km',
      vehicleType: state.activeVehicle?.vehicleType || 'bike',
    });
  };

  const handleAccept = () => {
    const fare = incomingReq?.fare || 50;
    setIncomingReq(null);
    Alert.alert(
      'Ride Accepted! 🎉',
      `Navigate to pickup point. You will earn ৳${fare} cash on completion.`,
      [{ text: 'Start Navigation', onPress: () => router.push('/(tabs)/(home)') }]
    );
  };

  const handleDecline = () => {
    setIncomingReq(null);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Rider Mode</Text>
          <Text style={styles.headerSub}>AIUB Peer Rider Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.adminSwitchBtn}
          onPress={() => router.push('/admin' as any)}
        >
          <Ionicons name="shield-outline" size={16} color="#0D9488" />
          <Text style={styles.adminSwitchText}>Admin Panel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Online Status Toggle Card */}
        <View style={[styles.statusCard, state.isOnline ? styles.onlineCard : styles.offlineCard]}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusDot, state.isOnline ? styles.dotOnline : styles.dotOffline]} />
            <View>
              <Text style={styles.statusTitle}>
                {state.isOnline ? 'Online • Accepting Campus Rides' : 'Offline • Invisible to Passengers'}
              </Text>
              <Text style={styles.statusSub}>
                {state.isOnline ? 'Matched with students near AIUB' : 'Turn on to start earning fuel costs'}
              </Text>
            </View>
          </View>
          <Switch
            value={state.isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: '#CBD5E1', true: '#0D9488' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Daily Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>৳{state.totalEarningsToday}</Text>
            <Text style={styles.statLabel}>Today's Fuel Shared</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{state.completedRidesCount}</Text>
            <Text style={styles.statLabel}>Trips Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>4.9 ★</Text>
            <Text style={styles.statLabel}>Peer Rating</Text>
          </View>
        </View>

        {/* Vehicle Registration Status Card */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>REGISTERED VEHICLE</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/(rider)/vehicle-register' as any)}>
            <Text style={styles.actionLink}>Update Info</Text>
          </TouchableOpacity>
        </View>

        {state.activeVehicle ? (
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleIconCircle}>
              <Ionicons
                name={state.activeVehicle.vehicleType === 'bike' ? 'bicycle' : 'car'}
                size={22}
                color="#0D9488"
              />
            </View>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleModel}>{state.activeVehicle.vehicleModel}</Text>
              <Text style={styles.vehiclePlate}>{state.activeVehicle.vehiclePlate}</Text>
              <Text style={styles.licenseNo}>License: {state.activeVehicle.drivingLicenseNo}</Text>
            </View>
            <View style={styles.approvedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#0F6E56" />
              <Text style={styles.approvedText}>{state.activeVehicle.approvalStatus}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.noVehicleCard}
            onPress={() => router.push('/(tabs)/(rider)/vehicle-register' as any)}
          >
            <Ionicons name="add-circle-outline" size={28} color="#0D9488" />
            <Text style={styles.noVehicleText}>Register Your Bike / Car to Start</Text>
          </TouchableOpacity>
        )}

        {/* Simulate Dispatcher Test Button */}
        <Text style={styles.sectionHeader}>SIMULATION CONTROLS</Text>
        <TouchableOpacity
          style={styles.simulateBtn}
          onPress={simulateIncoming}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications" size={18} color="#FFFFFF" />
          <Text style={styles.simulateBtnText}>Simulate Incoming Ride Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportNavBtn}
          onPress={() => router.push('/(tabs)/(home)/feedback' as any)}
        >
          <Ionicons name="flag-outline" size={16} color="#64748B" />
          <Text style={styles.reportNavText}>Incident & Feedback Center →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Incoming Request Popup Modal */}
      <IncomingRequestModal
        visible={!!incomingReq}
        request={incomingReq}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0D1F4E',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#CCFBF1',
  },
  adminSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adminSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  onlineCard: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0D9488',
  },
  offlineCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnline: {
    backgroundColor: '#10B981',
  },
  dotOffline: {
    backgroundColor: '#94A3B8',
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  statusSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D1F4E',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  actionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  vehiclePlate: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 2,
  },
  licenseNo: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  approvedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F6E56',
  },
  noVehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  noVehicleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488',
    marginTop: 6,
  },
  simulateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 14,
  },
  simulateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reportNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  reportNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
