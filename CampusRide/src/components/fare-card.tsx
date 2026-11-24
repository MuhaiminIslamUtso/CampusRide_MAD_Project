import { FareCalculation } from '@/data/rides';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FareCardProps {
    vehicleType: 'bike' | 'car';
    fareInfo: FareCalculation;
    isSelected: boolean;
    onSelect: (type: 'bike' | 'car') => void;
}

export default function FareCard({ vehicleType, fareInfo, isSelected, onSelect }: FareCardProps) {
    const isBike = vehicleType === 'bike';

    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => onSelect(vehicleType)}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={isBike ? 'bicycle' : 'car'}
                    size={28}
                    color={isSelected ? '#0D9488' : '#64748B'}
                />
            </View>

            <View style={styles.details}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, isSelected && styles.selectedTitle]}>
                        {isBike ? 'Campus Bike' : 'Campus Car'}
                    </Text>
                    {isBike && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>POPULAR</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.subtext}>
                    {isBike ? 'Fastest for 1 student' : 'Comfortable for 1-3 peers'}
                </Text>
                <Text style={styles.rateHint}>
                    Base ৳{fareInfo.baseFare} + ৳{fareInfo.perKmRate}/km
                </Text>
            </View>

            <View style={styles.priceContainer}>
                <Text style={[styles.price, isSelected && styles.selectedPrice]}>
                    ৳{fareInfo.totalFare}
                </Text>
                <Text style={styles.etaText}>~{isBike ? '8 mins' : '12 mins'}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        marginBottom: 10,
    },
    selectedCard: {
        borderColor: '#0D9488',
        backgroundColor: '#F0FDFA',
    },
    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    details: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0D1F4E',
    },
    selectedTitle: {
        color: '#0D9488',
    },
    badge: {
        backgroundColor: '#E1F5EE',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0F6E56',
    },
    subtext: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    rateHint: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0D1F4E',
    },
    selectedPrice: {
        color: '#0D9488',
    },
    etaText: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },
});
