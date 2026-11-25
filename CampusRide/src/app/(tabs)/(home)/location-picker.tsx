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
import { LocationPoint } from '@/data/rides';
import { POPULAR_CAMPUS_LOCATIONS } from '@/data/mock-rides';

export default function LocationPickerScreen() {
  const [activeTab, setActiveTab] = useState<'PICKUP' | 'DESTINATION'>('PICKUP');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPickup, setSelectedPickup] = useState<LocationPoint>(POPULAR_CAMPUS_LOCATIONS[2]);
  const [selectedDestination, setSelectedDestination] = useState<LocationPoint>(POPULAR_CAMPUS_LOCATIONS[0]);

  const filteredLocations = POPULAR_CAMPUS_LOCATIONS.filter(
    (loc) =>
      loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: LocationPoint) => {
    if (activeTab === 'PICKUP') {
      setSelectedPickup(loc);
      setActiveTab('DESTINATION');
    } else {
      setSelectedDestination(loc);
    }
  };

  const handleConfirmRoute = () => {
    router.replace('/(tabs)/(home)');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Campus Route</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        {/* Toggle Target Selector */}
        <View style={styles.targetSelector}>
          <TouchableOpacity
            style={[styles.targetBtn, activeTab === 'PICKUP' && styles.targetBtnActive]}
            onPress={() => setActiveTab('PICKUP')}
          >
            <Ionicons name="radio-button-on" size={14} color={activeTab === 'PICKUP' ? '#0D9488' : '#64748B'} />
            <View>
              <Text style={styles.targetLabel}>PICKUP</Text>
              <Text style={styles.targetVal} numberOfLines={1}>{selectedPickup.title}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.targetDivider} />

          <TouchableOpacity
            style={[styles.targetBtn, activeTab === 'DESTINATION' && styles.targetBtnActive]}
            onPress={() => setActiveTab('DESTINATION')}
          >
            <Ionicons name="location" size={14} color={activeTab === 'DESTINATION' ? '#EF4444' : '#64748B'} />
            <View>
              <Text style={styles.targetLabel}>DROP-OFF</Text>
              <Text style={styles.targetVal} numberOfLines={1}>{selectedDestination.title}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Map Coordinates Preview Container */}
        <View style={styles.mapPreviewBox}>
          <View style={styles.gridLine1} />
          <View style={styles.gridLine2} />
          <View style={styles.gpsMarker}>
            <Ionicons name="navigate-circle" size={20} color="#0D9488" />
            <Text style={styles.gpsMarkerText}>
              Selecting {activeTab === 'PICKUP' ? 'Pickup Coordinate' : 'Campus Gate'}
            </Text>
          </View>
          <Text style={styles.coordSub}>
            Lat: {activeTab === 'PICKUP' ? selectedPickup.latitude : selectedDestination.latitude} • Long:{' '}
            {activeTab === 'PICKUP' ? selectedPickup.longitude : selectedDestination.longitude}
          </Text>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab === 'PICKUP' ? 'pickup spot' : 'drop-off location'}...`}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Location List */}
        <Text style={styles.listHeader}>POPULAR CAMPUS HUBS & GATES</Text>
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => {
            const isPicked =
              activeTab === 'PICKUP'
                ? selectedPickup.title === item.title
                : selectedDestination.title === item.title;

            return (
              <TouchableOpacity
                style={[styles.locRow, isPicked && styles.locRowPicked]}
                onPress={() => handleSelectLocation(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.locIconCircle, isPicked && styles.locIconCirclePicked]}>
                  <Ionicons
                    name="location-sharp"
                    size={16}
                    color={isPicked ? '#FFFFFF' : '#0D9488'}
                  />
                </View>
                <View style={styles.locTextContainer}>
                  <Text style={[styles.locTitle, isPicked && styles.locTitlePicked]}>
                    {item.title}
                  </Text>
                  <Text style={styles.locAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
                {isPicked && <Ionicons name="checkmark-circle" size={20} color="#0D9488" />}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* Confirm Button Dock */}
      <View style={styles.dock}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmRoute} activeOpacity={0.8}>
          <Text style={styles.confirmBtnText}>Confirm Route & See Fares →</Text>
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
  targetSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  targetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
  },
  targetBtnActive: {
    backgroundColor: '#F0FDFA',
  },
  targetLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  targetVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D1F4E',
    maxWidth: 110,
  },
  targetDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  mapPreviewBox: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  gridLine1: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  gridLine2: {
    position: 'absolute',
    left: 140,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  gpsMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  gpsMarkerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  coordSub: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  listHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locRowPicked: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  locIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locIconCirclePicked: {
    backgroundColor: '#0D9488',
  },
  locTextContainer: {
    flex: 1,
  },
  locTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  locTitlePicked: {
    color: '#0D9488',
  },
  locAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
