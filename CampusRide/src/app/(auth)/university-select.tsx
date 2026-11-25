import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UNIVERSITIES, University } from '@/data/universities';
import { useAuth } from '@/context/auth-context';

export default function UniversitySelectScreen() {
  const { selectUniversity } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUni, setSelectedUni] = useState<University | null>(UNIVERSITIES[0]);

  // Derived filter list (Faculty pattern: live filtering via state query)
  const filteredUniversities = UNIVERSITIES.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.campusLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedUni) return;
    selectUniversity(selectedUni.id, selectedUni.name);
    // Move to next step in onboarding: ID Verification
    router.push('/(auth)/verify-id');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your University</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructions}>
          CampusRide matches you exclusively with students from your campus and neighboring universities.
        </Text>

        {/* Search Input Bar (Week 2 SearchBar Pattern) */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search AIUB, NSU, BRAC, DU..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Universities FlatList */}
        <FlatList
          data={filteredUniversities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isSelected = selectedUni?.id === item.id;
            return (
              <TouchableOpacity
                style={[styles.uniCard, isSelected && styles.uniCardSelected]}
                onPress={() => setSelectedUni(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                  <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                    {item.shortName}
                  </Text>
                </View>
                <View style={styles.uniInfo}>
                  <Text style={styles.uniName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.uniLocation} numberOfLines={1}>
                    📍 {item.campusLocation}
                  </Text>
                  <Text style={styles.uniDomain}>Official domain: @{item.domain}</Text>
                </View>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? '#0D9488' : '#CBD5E1'}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No university found matching "{searchQuery}".</Text>
            </View>
          }
        />
      </View>

      {/* Bottom Confirm Dock */}
      <View style={styles.dock}>
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedUni && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selectedUni}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmBtnText}>
            Continue as {selectedUni ? selectedUni.shortName : ''} Student →
          </Text>
        </TouchableOpacity>
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
  instructions: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  listContent: {
    paddingBottom: 80,
  },
  uniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  uniCardSelected: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeSelected: {
    backgroundColor: '#0D9488',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D1F4E',
  },
  badgeTextSelected: {
    color: '#FFFFFF',
  },
  uniInfo: {
    flex: 1,
    marginRight: 8,
  },
  uniName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  uniLocation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  uniDomain: {
    fontSize: 10,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  dock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  confirmBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
