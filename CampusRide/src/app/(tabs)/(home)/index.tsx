import FareCard from "@/components/fare-card";
import MapSimulationView from "@/components/map-simulation-view";
import { useRide } from "@/context/ride-context";
import { POPULAR_CAMPUS_LOCATIONS } from "@/data/mock-rides";
import { LocationPoint } from "@/data/rides";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveBookingScreen() {
    const { state, requestNewRide, calculateFare } = useRide();

    // Selected pickup & destination
    const [pickup, setPickup] = useState<LocationPoint>(
        POPULAR_CAMPUS_LOCATIONS[2],
    ); // Kuratoli Railgate
    const [destination, setDestination] = useState<LocationPoint>(
        POPULAR_CAMPUS_LOCATIONS[0],
    ); // AIUB Permanent Campus
    const [vehicleType, setVehicleType] = useState<"bike" | "car">("bike");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic fare calculations for both vehicle types
    const distanceEstimate = 2.4;
    const bikeFare = calculateFare(distanceEstimate, "bike");
    const carFare = calculateFare(distanceEstimate, "car");

    const handleSwapLocations = () => {
        const temp = pickup;
        setPickup(destination);
        setDestination(temp);
    };

    const handleRequestRide = () => {
        setIsSubmitting(true);

        // Simulate instant atomic match dispatch
        setTimeout(() => {
            setIsSubmitting(false);
            requestNewRide(pickup, destination, vehicleType);
            router.push("/(tabs)/(home)/live-tracking");
        }, 800);
    };

    return (
        <SafeAreaView style={styles.screen}>
            {/* Top Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.appName}>CampusRide</Text>
                    <Text style={styles.tagline}>AIUB Verified Student Commute</Text>
                </View>
                <TouchableOpacity
                    style={styles.historyBtn}
                    onPress={() => router.push("/history")}
                    activeOpacity={0.7}
                >
                    <Ionicons name="time-outline" size={18} color="#0D9488" />
                    <Text style={styles.historyBtnText}>History</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Interactive Map Section */}
                <MapSimulationView pickup={pickup} destination={destination} />

                {/* Location Selection Box */}
                <View style={styles.locationCard}>
                    <View style={styles.locationRow}>
                        <View style={styles.iconCircleGreen}>
                            <Ionicons name="radio-button-on" size={14} color="#0D9488" />
                        </View>
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
                            <Text style={styles.locationValue} numberOfLines={1}>
                                {pickup.title}
                            </Text>
                            <Text style={styles.locationSub}>{pickup.address}</Text>
                        </View>
                    </View>

                    <View style={styles.dividerRow}>
                        <View style={styles.dashedLine} />
                        <TouchableOpacity
                            style={styles.swapBtn}
                            onPress={handleSwapLocations}
                        >
                            <Ionicons name="swap-vertical" size={16} color="#0D9488" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.locationRow}>
                        <View style={styles.iconCircleRed}>
                            <Ionicons name="location" size={14} color="#EF4444" />
                        </View>
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationLabel}>CAMPUS DESTINATION</Text>
                            <Text style={styles.locationValue} numberOfLines={1}>
                                {destination.title}
                            </Text>
                            <Text style={styles.locationSub}>{destination.address}</Text>
                        </View>
                    </View>
                </View>

                {/* Distance & Student Security Note */}
                <View style={styles.securityBanner}>
                    <Ionicons name="shield-checkmark" size={16} color="#0F6E56" />
                    <Text style={styles.securityText}>
                        Estimated: {distanceEstimate} km • Only verified university peers
                        can accept
                    </Text>
                </View>

                {/* Vehicle & Dynamic Fare Selection */}
                <Text style={styles.sectionHeader}>SELECT COMMUTE TYPE</Text>

                <FareCard
                    vehicleType="bike"
                    fareInfo={bikeFare}
                    isSelected={vehicleType === "bike"}
                    onSelect={setVehicleType}
                />

                <FareCard
                    vehicleType="car"
                    fareInfo={carFare}
                    isSelected={vehicleType === "car"}
                    onSelect={setVehicleType}
                />

                {/* Quick Pick Campus Hubs */}
                <Text style={styles.sectionHeader}>NEARBY CAMPUS PICKUP HUBS</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.hubsScroll}
                >
                    {POPULAR_CAMPUS_LOCATIONS.map((loc, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.hubPill,
                                pickup.title === loc.title && styles.activeHubPill,
                            ]}
                            onPress={() => setPickup(loc)}
                        >
                            <Ionicons
                                name="school-outline"
                                size={14}
                                color={pickup.title === loc.title ? "#FFFFFF" : "#0D9488"}
                            />
                            <Text
                                style={[
                                    styles.hubPillText,
                                    pickup.title === loc.title && styles.activeHubPillText,
                                ]}
                            >
                                {loc.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ScrollView>

            {/* Request Button Dock */}
            <View style={styles.bottomDock}>
                <TouchableOpacity
                    style={[styles.requestBtn, isSubmitting && styles.requestBtnDisabled]}
                    onPress={handleRequestRide}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <View style={styles.btnContent}>
                            <Text style={styles.requestBtnText}>
                                Request {vehicleType === "bike" ? "Campus Bike" : "Campus Car"}{" "}
                                • ৳
                                {vehicleType === "bike"
                                    ? bikeFare.totalFare
                                    : carFare.totalFare}
                            </Text>
                            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#0D1F4E",
    },
    appName: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 11,
        color: "#CCFBF1",
        fontWeight: "500",
    },
    historyBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    historyBtnText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#0D9488",
    },
    content: {
        padding: 16,
        paddingBottom: 90,
    },
    locationCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        marginVertical: 12,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconCircleGreen: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#E1F5EE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    iconCircleRed: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FEE2E2",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    locationTextContainer: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#94A3B8",
        letterSpacing: 0.5,
    },
    locationValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0D1F4E",
        marginTop: 1,
    },
    locationSub: {
        fontSize: 11,
        color: "#64748B",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 4,
        paddingLeft: 38,
    },
    dashedLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E8F0",
    },
    swapBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#F0FDFA",
        borderWidth: 1,
        borderColor: "#CCFBF1",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    securityBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#E1F5EE",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 16,
    },
    securityText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#0F6E56",
        flex: 1,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: "800",
        color: "#64748B",
        letterSpacing: 0.8,
        marginBottom: 8,
        marginTop: 4,
    },
    hubsScroll: {
        marginBottom: 16,
    },
    hubPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CCFBF1",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    activeHubPill: {
        backgroundColor: "#0D9488",
        borderColor: "#0D9488",
    },
    hubPillText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#0D9488",
    },
    activeHubPillText: {
        color: "#FFFFFF",
    },
    bottomDock: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
    },
    requestBtn: {
        backgroundColor: "#0D9488",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    requestBtnDisabled: {
        backgroundColor: "#94A3B8",
    },
    btnContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    requestBtnText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});
