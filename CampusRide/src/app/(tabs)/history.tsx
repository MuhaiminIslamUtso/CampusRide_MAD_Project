import RideHistoryCard from '@/components/ride-history-card';
import { useRide } from '@/context/ride-context';
import { RideRequest } from '@/data/rides';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideHistoryScreen() {
    const { state } = useRide();
    const [filterType, setFilterType] = useState<'ALL' | 'BIKE' | 'CAR'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null);

    // Derived filter list (Faculty principle: never duplicate filtered lists in useState)
    const filteredHistory = state.history.filter((ride) => {
        const matchesType =
            filterType === 'ALL'
                ? true
                : filterType === 'BIKE'
                    ? ride.vehicleType === 'bike'
                    : ride.vehicleType === 'car';

        const matchesSearch =
            ride.pickup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.id.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesType && matchesSearch;
    });

    return (
        <SafeAreaView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Ride History ({state.history.length})</Text>
                <View style={{ width: 32 }} />
            </View>

            {/* Search Input Bar (Week 2 pattern) */}
            <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by pickup, destination or trip ID..."
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

            {/* Filter Segment Pills (Week 3 Lab Task 1 pattern) */}
            <View style={styles.filterRow}>
                {(['ALL', 'BIKE', 'CAR'] as const).map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.filterPill, filterType === type && styles.filterPillActive]}
                        onPress={() => setFilterType(type)}
                    >
                        <Text
                            style={[styles.filterPillText, filterType === type && styles.filterPillTextActive]}
                        >
                            {type === 'ALL' ? 'All Trips' : type === 'BIKE' ? 'Bikes Only' : 'Cars Only'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* History FlatList */}
            <FlatList
                data={filteredHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RideHistoryCard ride={item} onPress={(ride) => setSelectedRide(ride)} />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                        <Text style={styles.emptyTitle}>No matching trips found</Text>
                        <Text style={styles.emptySub}>
                            {searchQuery ? `No rides matching "${searchQuery}"` : 'Take your first ride today!'}
                        </Text>
                    </View>
                }
            />

            {/* Ride Detail Modal */}
            {selectedRide && (
                <Modal
                    visible={true}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setSelectedRide(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Trip Details #{selectedRide.id}</Text>
                                <TouchableOpacity onPress={() => setSelectedRide(null)}>
                                    <Ionicons name="close" size={22} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalLabel}>Date & Time:</Text>
                                <Text style={styles.modalVal}>{selectedRide.createdAt}</Text>
                            </View>

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalLabel}>Status:</Text>
                                <Text
                                    style={[
                                        styles.modalVal,
                                        {
                                            color: selectedRide.status === 'COMPLETED' ? '#0D9488' : '#DC2626',
                                            fontWeight: '700',
                                        },
                                    ]}
                                >
                                    {selectedRide.status}
                                </Text>
                            </View>

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalLabel}>Vehicle:</Text>
                                <Text style={styles.modalVal}>
                                    {selectedRide.vehicleType === 'bike' ? 'Campus Bike' : 'Campus Car'}
                                </Text>
                            </View>

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalLabel}>Pickup:</Text>
                                <Text style={[styles.modalVal, { flex: 1, textAlign: 'right' }]}>
                                    {selectedRide.pickup.title}
                                </Text>
                            </View>

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalLabel}>Destination:</Text>
                                <Text style={[styles.modalVal, { flex: 1, textAlign: 'right' }]}>
                                    {selectedRide.destination.title}
                                </Text>
                            </View>

                            <View style={styles.modalDetailRow}>
                                <Text style={styles.modalLabel}>Fare Charged:</Text>
                                <Text style={[styles.modalVal, { color: '#0D9488', fontSize: 16, fontWeight: '800' }]}>
                                    ৳{selectedRide.fare}
                                </Text>
                            </View>

                            {selectedRide.rider && (
                                <View style={styles.riderModalBox}>
                                    <Text style={styles.riderModalTitle}>Rider Info</Text>
                                    <Text style={styles.riderModalText}>
                                        {selectedRide.rider.name} ({selectedRide.rider.university})
                                    </Text>
                                    <Text style={styles.riderModalPlate}>
                                        {selectedRide.rider.vehiclePlate} • {selectedRide.rider.vehicleModel}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.closeBtn}
                                onPress={() => setSelectedRide(null)}
                            >
                                <Text style={styles.closeBtnText}>Close Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
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
        paddingVertical: 14,
        backgroundColor: '#0D1F4E',
    },
    backBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 13,
        color: '#1E293B',
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterPill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    filterPillActive: {
        backgroundColor: '#0D9488',
        borderColor: '#0D9488',
    },
    filterPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    filterPillTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0D1F4E',
        marginTop: 12,
    },
    emptySub: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0D1F4E',
    },
    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalLabel: {
        fontSize: 13,
        color: '#64748B',
    },
    modalVal: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0D1F4E',
    },
    riderModalBox: {
        backgroundColor: '#F0FDFA',
        padding: 12,
        borderRadius: 10,
        marginVertical: 14,
        borderWidth: 1,
        borderColor: '#CCFBF1',
    },
    riderModalTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0D9488',
        textTransform: 'uppercase',
    },
    riderModalText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0D1F4E',
        marginTop: 2,
    },
    riderModalPlate: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    closeBtn: {
        backgroundColor: '#0D9488',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    closeBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
