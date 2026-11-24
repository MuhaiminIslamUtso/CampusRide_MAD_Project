import MapSimulationView from "@/components/map-simulation-view";
import RiderInfoCard from "@/components/ride-info-card";
import { useRide } from "@/context/ride-context";
import { MOCK_RIDERS } from "@/data/mock-rides";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveTrackingScreen() {
    const { state, dispatch } = useRide();
    const currentRide = state.currentRide;

    const [simulatedEta, setSimulatedEta] = useState(4);
    const [riderLocationText, setRiderLocationText] = useState(
        "Approaching Kuratoli Road (200m away)",
    );

    // Auto-progress simulation: SEARCHING -> ACCEPTED -> ARRIVED -> IN_TRIP -> COMPLETED
    // Demonstrates WebSocket Lifecycle (Proposal Feature 2)
    useEffect(() => {
        if (!currentRide) return;

        let timeoutId: any;

        if (currentRide.status === "SEARCHING") {
            timeoutId = setTimeout(() => {
                // Assign first nearby peer rider
                const matchedRider =
                    currentRide.vehicleType === "bike" ? MOCK_RIDERS[0] : MOCK_RIDERS[2];
                dispatch({ type: "RIDER_ASSIGNED", payload: matchedRider });
            }, 2500);
        } else if (currentRide.status === "ACCEPTED") {
            timeoutId = setTimeout(() => {
                dispatch({ type: "UPDATE_STATUS", payload: "ARRIVED" });
                setSimulatedEta(0);
                setRiderLocationText("Rider arrived at your pickup point");
            }, 4000);
        } else if (currentRide.status === "ARRIVED") {
            timeoutId = setTimeout(() => {
                dispatch({ type: "UPDATE_STATUS", payload: "IN_TRIP" });
                setRiderLocationText("Trip in progress towards AIUB Campus");
            }, 3500);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [currentRide?.status]);

    if (!currentRide) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No Active Ride in Progress</Text>
                <Text style={styles.emptySubtitle}>
                    Request a ride from the CampusRide home screen.
                </Text>
                <TouchableOpacity
                    style={styles.backHomeBtn}
                    onPress={() => router.replace("/(tabs)/(home)")}
                >
                    <Text style={styles.backHomeBtnText}>Go to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleManualTripFinish = () => {
        dispatch({ type: "COMPLETE_RIDE" });
        router.replace("/(tabs)/(home)/trip-receipt");
    };

    const handleCancelRide = () => {
        Alert.alert(
            "Cancel Ride",
            "Are you sure you want to cancel this campus ride request?",
            [
                { text: "Keep Ride", style: "cancel" },
                {
                    text: "Cancel Ride",
                    style: "destructive",
                    onPress: () => {
                        dispatch({ type: "CANCEL_RIDE" });
                        router.replace("/(tabs)/(home)");
                    },
                },
            ],
        );
    };

    const isSearching = currentRide.status === "SEARCHING";
    const isAccepted = currentRide.status === "ACCEPTED";
    const isArrived = currentRide.status === "ARRIVED";
    const isInTrip = currentRide.status === "IN_TRIP";

    return (
        <SafeAreaView style={styles.screen}>
            {/* Navigation Header */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.navBackBtn}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.navTitleContainer}>
                    <Text style={styles.navTitle}>Live Ride Tracking</Text>
                    <Text style={styles.navSub}>Ride ID: {currentRide.id}</Text>
                </View>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Real-time Status Card */}
                <View style={styles.statusBanner}>
                    <View style={styles.statusIndicatorRow}>
                        {isSearching ? (
                            <ActivityIndicator color="#0D9488" size="small" />
                        ) : (
                            <View style={styles.statusPulse} />
                        )}
                        <Text style={styles.statusHeadline}>
                            {isSearching && "Searching for Nearby Student Riders..."}
                            {isAccepted && `Rider Accepted! Arriving in ${simulatedEta} mins`}
                            {isArrived && "Rider Arrived! Meet at pickup"}
                            {isInTrip && "Trip in Progress • En route to Campus"}
                        </Text>
                    </View>

                    <Text style={styles.statusSubtext}>
                        {isSearching &&
                            "Broadcasting atomic ride request via WebSocket engine"}
                        {isAccepted && `Rider ${currentRide.rider?.name} is on the way`}
                        {isArrived &&
                            "Please verify rider student ID and vehicle license plate"}
                        {isInTrip && "Estimated remaining travel time: ~5 mins"}
                    </Text>

                    {/* Stepper Status Indicators */}
                    <View style={styles.stepperContainer}>
                        <View style={[styles.stepDot, styles.stepActive]}>
                            <Text style={styles.stepNum}>1</Text>
                        </View>
                        <View
                            style={[
                                styles.stepLine,
                                (isAccepted || isArrived || isInTrip) && styles.stepLineActive,
                            ]}
                        />
                        <View
                            style={[
                                styles.stepDot,
                                (isAccepted || isArrived || isInTrip) && styles.stepActive,
                            ]}
                        >
                            <Text style={styles.stepNum}>2</Text>
                        </View>
                        <View
                            style={[
                                styles.stepLine,
                                (isArrived || isInTrip) && styles.stepLineActive,
                            ]}
                        />
                        <View
                            style={[
                                styles.stepDot,
                                (isArrived || isInTrip) && styles.stepActive,
                            ]}
                        >
                            <Text style={styles.stepNum}>3</Text>
                        </View>
                        <View
                            style={[styles.stepLine, isInTrip && styles.stepLineActive]}
                        />
                        <View style={[styles.stepDot, isInTrip && styles.stepActive]}>
                            <Text style={styles.stepNum}>4</Text>
                        </View>
                    </View>
                    <View style={styles.stepLabelsRow}>
                        <Text style={styles.stepLabel}>Search</Text>
                        <Text style={styles.stepLabel}>Accepted</Text>
                        <Text style={styles.stepLabel}>Arrived</Text>
                        <Text style={styles.stepLabel}>In Trip</Text>
                    </View>
                </View>

                {/* Live Simulation Map */}
                <MapSimulationView
                    pickup={currentRide.pickup}
                    destination={currentRide.destination}
                    riderLocationText={riderLocationText}
                    isLiveTracking={!isSearching}
                />

                {/* Rider Details (once accepted) */}
                {currentRide.rider && (
                    <View style={styles.riderSection}>
                        <Text style={styles.sectionTitle}>YOUR VERIFIED STUDENT RIDER</Text>
                        <RiderInfoCard rider={currentRide.rider} />
                    </View>
                )}

                {/* Ride Fare & Route Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Student Fare</Text>
                        <Text style={styles.summaryValue}>৳{currentRide.fare}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Commute Mode</Text>
                        <Text style={styles.summaryValue}>
                            {currentRide.vehicleType === "bike"
                                ? "Campus Bike"
                                : "Campus Car"}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Distance</Text>
                        <Text style={styles.summaryValue}>{currentRide.distanceKm} km</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Controls */}
            <View style={styles.bottomDock}>
                {isInTrip || isArrived ? (
                    <TouchableOpacity
                        style={styles.finishBtn}
                        onPress={handleManualTripFinish}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.finishBtnText}>
                            Complete Trip & View Receipt
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={handleCancelRide}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                        <Text style={styles.cancelBtnText}>Cancel Ride</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0D1F4E",
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#64748B",
        textAlign: "center",
        marginTop: 4,
        marginBottom: 20,
    },
    backHomeBtn: {
        backgroundColor: "#0D9488",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backHomeBtnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
    navBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#0D1F4E",
    },
    navBackBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    navTitleContainer: {
        alignItems: "center",
    },
    navTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    navSub: {
        fontSize: 11,
        color: "#CCFBF1",
    },
    content: {
        padding: 16,
        paddingBottom: 90,
    },
    statusBanner: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statusIndicatorRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusPulse: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#10B981",
    },
    statusHeadline: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0D1F4E",
        flex: 1,
    },
    statusSubtext: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 4,
        lineHeight: 18,
    },
    stepperContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        paddingHorizontal: 12,
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#E2E8F0",
        alignItems: "center",
        justifyContent: "center",
    },
    stepActive: {
        backgroundColor: "#0D9488",
    },
    stepNum: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    stepLine: {
        flex: 1,
        height: 3,
        backgroundColor: "#E2E8F0",
    },
    stepLineActive: {
        backgroundColor: "#0D9488",
    },
    stepLabelsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginTop: 6,
    },
    stepLabel: {
        fontSize: 10,
        color: "#64748B",
        fontWeight: "600",
    },
    riderSection: {
        marginTop: 14,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: "#64748B",
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    summaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        marginTop: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        gap: 8,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryLabel: {
        fontSize: 13,
        color: "#64748B",
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0D1F4E",
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
    finishBtn: {
        backgroundColor: "#0D9488",
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    finishBtnText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    cancelBtn: {
        backgroundColor: "#FEE2E2",
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#DC2626",
    },
});
