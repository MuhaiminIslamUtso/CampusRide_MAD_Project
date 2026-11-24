import { RideRequest } from '@/data/rides';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RideHistoryCardProps {
    ride: RideRequest;
    onPress: (ride: RideRequest) => void;
}

export default function RideHistoryCard({ ride, onPress }: RideHistoryCardProps) {
    const isCompleted = ride.status === 'COMPLETED';

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(ride)}
            activeOpacity={0.7}
        >
            <View style={styles.topRow}>
                <View style={styles.vehicleType}>
                    <Ionicons
                        name={ride.vehicleType === 'bike' ? 'bicycle' : 'car'}
                        size={16}
                        color="#0D9488"
                    />
                    <Text style={styles.vehicleText}>
                        {ride.vehicleType === 'bike' ? 'Bike Ride' : 'Car Ride'}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        isCompleted ? styles.completedBadge : styles.cancelledBadge,
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            isCompleted ? styles.completedText : styles.cancelledText,
                        ]}
                    >
                        {ride.status}
                    </Text>
                </View>
            </View>

            <View style={styles.routeContainer}>
                <View style={styles.routeIconCol}>
                    <View style={styles.greenDot} />
                    <View style={styles.routeLine} />
                    <View style={styles.redDot} />
                </View>

                <View style={styles.routeTextCol}>
                    <Text style={styles.locationTitle} numberOfLines={1}>
                        {ride.pickup.title}
                    </Text>
                    <Text style={styles.locationTitle} numberOfLines={1}>
                        {ride.destination.title}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
                <Text style={styles.dateText}>{ride.createdAt}</Text>
                <Text style={styles.fareText}>৳{ride.fare}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    vehicleType: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    vehicleText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0D1F4E',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    completedBadge: {
        backgroundColor: '#E1F5EE',
    },
    cancelledBadge: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    completedText: {
        color: '#0F6E56',
    },
    cancelledText: {
        color: '#DC2626',
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    routeIconCol: {
        alignItems: 'center',
        marginRight: 10,
        width: 14,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0D9488',
    },
    routeLine: {
        width: 2,
        height: 18,
        backgroundColor: '#CBD5E1',
        marginVertical: 2,
    },
    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    routeTextCol: {
        flex: 1,
        justifyContent: 'space-between',
        height: 36,
    },
    locationTitle: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    fareText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0D1F4E',
    },
});
