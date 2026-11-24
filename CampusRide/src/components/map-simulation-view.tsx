import { LocationPoint } from '@/data/rides';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface MapSimulationViewProps {
    pickup: LocationPoint;
    destination: LocationPoint;
    riderLocationText?: string;
    isLiveTracking?: boolean;
}

export default function MapSimulationView({
    pickup,
    destination,
    riderLocationText = 'Nearby AIUB campus area',
    isLiveTracking = false,
}: MapSimulationViewProps) {
    return (
        <View style={styles.mapContainer}>
            {/* Decorative Grid Lines simulating map streets */}
            <View style={styles.gridLineHorizontal1} />
            <View style={styles.gridLineHorizontal2} />
            <View style={styles.gridLineVertical1} />
            <View style={styles.gridLineVertical2} />

            {/* Floating GPS live badge */}
            <View style={styles.gpsBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.gpsText}>GPS Active: Kuratoli & Khilkhet Hub</Text>
            </View>

            {/* Pickup Marker */}
            <View style={[styles.marker, styles.pickupMarker]}>
                <Ionicons name="location" size={20} color="#0D9488" />
                <View style={styles.markerLabel}>
                    <Text style={styles.markerLabelText} numberOfLines={1}>
                        Pickup: {pickup.title}
                    </Text>
                </View>
            </View>

            {/* Simulated Route Arc */}
            <View style={styles.routeTrace}>
                <Ionicons name="ellipsis-vertical" size={24} color="#0D9488" />
            </View>

            {/* Destination Marker */}
            <View style={[styles.marker, styles.destinationMarker]}>
                <Ionicons name="flag" size={18} color="#EF4444" />
                <View style={styles.markerLabel}>
                    <Text style={styles.markerLabelText} numberOfLines={1}>
                        Dropoff: {destination.title}
                    </Text>
                </View>
            </View>

            {/* Live rider position marker if in live tracking mode */}
            {isLiveTracking && (
                <View style={styles.riderLiveMarker}>
                    <Ionicons name="navigate" size={16} color="#FFFFFF" />
                    <Text style={styles.riderPinText}>Rider</Text>
                </View>
            )}

            {/* Bottom overlay status */}
            <View style={styles.mapFooter}>
                <Ionicons name="navigate-circle-outline" size={16} color="#0F6E56" />
                <Text style={styles.mapFooterText} numberOfLines={1}>
                    {isLiveTracking ? `Live rider GPS: ${riderLocationText}` : 'Direct student corridor route calculated'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 190,
        backgroundColor: '#E2E8F0',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'space-between',
        padding: 12,
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    gridLineHorizontal1: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#CBD5E1',
    },
    gridLineHorizontal2: {
        position: 'absolute',
        top: 130,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#CBD5E1',
    },
    gridLineVertical1: {
        position: 'absolute',
        left: 90,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#CBD5E1',
    },
    gridLineVertical2: {
        position: 'absolute',
        right: 110,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#CBD5E1',
    },
    gpsBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    gpsText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0D1F4E',
    },
    marker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pickupMarker: {
        marginLeft: 16,
    },
    destinationMarker: {
        marginLeft: 80,
    },
    routeTrace: {
        marginLeft: 30,
        opacity: 0.6,
    },
    markerLabel: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxWidth: 200,
    },
    markerLabelText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1E293B',
    },
    riderLiveMarker: {
        position: 'absolute',
        right: 40,
        top: 75,
        backgroundColor: '#0D9488',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4,
    },
    riderPinText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    mapFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E1F5EE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'stretch',
    },
    mapFooterText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0F6E56',
    },
});
