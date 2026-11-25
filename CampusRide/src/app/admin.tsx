import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiderAdmin } from '../../context/rider-admin-context';
import { VerificationRequest } from '../../data/rider-admin';

export default function AdminScreen() {
  const { state, updateVerification } = useRiderAdmin();
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');

  const filteredRequests = state.verificationRequests.filter((req) => {
    if (activeTab === 'ALL') return true;
    return req.status === activeTab;
  });

  const handleApprove = (req: VerificationRequest) => {
    Alert.alert(
      'Approve Request',
      `Grant verified status to ${req.studentName} (${req.studentId})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => updateVerification(req.id, 'APPROVED'),
        },
      ]
    );
  };

  const handleReject = (req: VerificationRequest) => {
    Alert.alert(
      'Reject Request',
      `Reject verification application for ${req.studentName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => updateVerification(req.id, 'REJECTED'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Approval & Controls</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        {/* Admin Overview Banner */}
        <View style={styles.adminBanner}>
          <Ionicons name="shield-checkmark" size={24} color="#0D9488" />
          <View style={styles.adminBannerText}>
            <Text style={styles.adminBannerTitle}>Institutional Security Gateway</Text>
            <Text style={styles.adminBannerSub}>
              Review student ID proofs, vehicle registration papers, and maintain campus safety standards.
            </Text>
          </View>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabRow}>
          {(['ALL', 'PENDING', 'APPROVED'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                {tab === 'ALL'
                  ? `All (${state.verificationRequests.length})`
                  : tab === 'PENDING'
                  ? `Pending (${state.verificationRequests.filter((r) => r.status === 'PENDING').length})`
                  : 'Approved'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Requests FlatList */}
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reqCard}>
              <View style={styles.reqHeader}>
                <View style={styles.reqTypeBadge}>
                  <Ionicons
                    name={item.requestType === 'VEHICLE_RIDER' ? 'bicycle' : 'school'}
                    size={14}
                    color="#0D9488"
                  />
                  <Text style={styles.reqTypeText}>
                    {item.requestType === 'VEHICLE_RIDER' ? 'RIDER APPLICATION' : 'STUDENT VERIFY'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'APPROVED' ? styles.statusApproved : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'APPROVED' ? styles.statusTextApproved : styles.statusTextPending,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.studentMeta}>
                {item.university} • ID: {item.studentId} • Dept: {item.department}
              </Text>

              {item.vehicleDetails && (
                <View style={styles.vehicleBox}>
                  <Text style={styles.vehicleBoxTitle}>Vehicle & License Data:</Text>
                  <Text style={styles.vehicleBoxVal}>{item.vehicleDetails}</Text>
                  <Text style={styles.licenseVal}>License: {item.licenseNumber}</Text>
                </View>
              )}

              <Text style={styles.timeText}>Submitted: {item.submittedAt}</Text>

              {/* Action Buttons if Pending */}
              {item.status === 'PENDING' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(item)}
                  >
                    <Ionicons name="close-circle-outline" size={16} color="#DC2626" />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(item)}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Approve Student</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No verification requests in this category.</Text>
            </View>
          }
        />
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0D1F4E',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E1F5EE',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  adminBannerText: {
    flex: 1,
  },
  adminBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  adminBannerSub: {
    fontSize: 11,
    color: '#0F6E56',
    marginTop: 2,
    lineHeight: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabBtnActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  reqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reqTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reqTypeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusApproved: {
    backgroundColor: '#E1F5EE',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextApproved: {
    color: '#0F6E56',
  },
  statusTextPending: {
    color: '#B45309',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  studentMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  vehicleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vehicleBoxTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  vehicleBoxVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  licenseVal: {
    fontSize: 11,
    color: '#0D9488',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0D9488',
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
