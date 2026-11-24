import { Rider } from '@/data/rides';
import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RiderInfoCardProps {
    rider: Rider;
    onCall?: () => void;
}

export default function RiderInfoCard({ rider, onCall }: RiderInfoCardProps) {
    const handleCall = () => {
        if (onCall) {
            onCall();
        } else {
            Linking.openURL(`tel:${rider.phone}`);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image source={{ uri: rider.avatarUrl }} style={styles.avatar} />
                <View style={styles.riderDetails}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{rider.name}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#0D9488" />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    </View>
                    <Text style={styles.studentId}>
                        {rider.university} Student • ID: {rider.studentId}
                    </Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.ratingText}>{rider.rating}</Text>
                        <Text style={styles.tripsText}>({rider.totalTrips} rides completed)</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.8}>
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.vehicleRow}>
                <View style={styles.vehicleIconBadge}>
                    <Ionicons
                        name={rider.vehicleType === 'bike' ? 'bicycle' : 'car'}
                        size={18}
                        color="#0D1F4E"
                    />
                </View>
                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleModel}>{rider.vehicleModel}</Text>
                    <Text style={styles.plateNumber}>{rider.vehiclePlate}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
    },
    riderDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0D1F4E',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#E1F5EE',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 10,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#0F6E56',
    },
    studentId: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0D1F4E',
    },
    tripsText: {
        fontSize: 11,
        color: '#94A3B8',
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0D9488',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    vehicleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    vehicleInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vehicleModel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
    },
    plateNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0D9488',
        backgroundColor: '#F0FDFA',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
});
