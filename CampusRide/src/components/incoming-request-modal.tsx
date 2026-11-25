import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface IncomingRequestData {
  id: string;
  passengerName: string;
  passengerUni: string;
  pickup: string;
  destination: string;
  fare: number;
  distance: string;
  vehicleType: 'bike' | 'car';
}

interface IncomingRequestModalProps {
  visible: boolean;
  request: IncomingRequestData | null;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingRequestModal({
  visible,
  request,
  onAccept,
  onDecline,
}: IncomingRequestModalProps) {
  if (!request) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={styles.banner}>
            <View style={styles.pulseDot} />
            <Text style={styles.bannerTitle}>INCOMING CAMPUS RIDE REQUEST</Text>
          </View>

          {/* Passenger Row */}
          <View style={styles.passengerRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#0D9488" />
            </View>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>{request.passengerName}</Text>
              <Text style={styles.passengerUni}>
                {request.passengerUni} Verified Student
              </Text>
            </View>
            <View style={styles.fareContainer}>
              <Text style={styles.fareAmount}>৳{request.fare}</Text>
              <Text style={styles.fareLabel}>Cash to you</Text>
            </View>
          </View>

          {/* Route Info */}
          <View style={styles.routeBox}>
            <View style={styles.routeItem}>
              <Ionicons name="radio-button-on" size={14} color="#0D9488" />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.routeValue}>{request.pickup}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeItem}>
              <Ionicons name="location" size={14} color="#EF4444" />
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>DROP-OFF</Text>
                <Text style={styles.routeValue}>{request.destination}</Text>
              </View>
            </View>
          </View>

          {/* Trip Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="speedometer-outline" size={14} color="#0D9488" />
              <Text style={styles.metaText}>{request.distance}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Ionicons name="bicycle-outline" size={14} color="#0D9488" />
              <Text style={styles.metaText}>
                {request.vehicleType === 'bike' ? 'Campus Bike' : 'Campus Car'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
              <Text style={styles.acceptBtnText}>Accept Ride (৳{request.fare})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 31, 78, 0.65)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  bannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F6E56',
    letterSpacing: 0.5,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  passengerUni: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D9488',
  },
  fareLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  routeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  routeLine: {
    width: 2,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginLeft: 6,
    marginVertical: 2,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  routeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  acceptBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
