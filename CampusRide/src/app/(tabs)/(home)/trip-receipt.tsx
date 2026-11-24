import { useRide } from "@/context/ride-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripReceiptScreen() {
    const { state, dispatch } = useRide();
    const currentRide = state.currentRide || state.history[0];

    const [rating, setRating] = useState(5);
    const [selectedTip, setSelectedTip] = useState<number | null>(null);

    if (!currentRide) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text style={styles.emptyText}>No recent receipt available.</Text>
                <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => router.replace("/(tabs)/(home)")}
                >
                    <Text style={styles.doneBtnText}>Return to Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleFinish = () => {
        dispatch({ type: "RESET_CURRENT_RIDE" });
        Alert.alert(
            "Trip Rated",
            "Thank you for keeping CampusRide safe and community-driven!",
            [{ text: "Done", onPress: () => router.replace("/(tabs)/(home)") }],
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Success Icon Badge */}
                <View style={styles.successHeader}>
                    <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={36} color="#FFFFFF" />
                    </View>
                    <Text style={styles.successTitle}>Trip Completed!</Text>
                    <Text style={styles.successSub}>
                        Hope you had a safe commute to campus
                    </Text>
                    <Text style={styles.receiptId}>Receipt #{currentRide.id}</Text>
                </View>

                {/* Fare Receipt Card */}
                <View style={styles.receiptCard}>
                    <View style={styles.fareHighlightRow}>
                        <Text style={styles.totalFareLabel}>Total Fare Paid</Text>
                        <Text style={styles.totalFareAmount}>৳{currentRide.fare}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Breakdown Rows */}
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Base Fare</Text>
                        <Text style={styles.breakdownValue}>
                            ৳{currentRide.vehicleType === "bike" ? 25 : 60}
                        </Text>
                    </View>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>
                            Distance Charge ({currentRide.distanceKm} km)
                        </Text>
                        <Text style={styles.breakdownValue}>
                            ৳
                            {Math.round(
                                currentRide.fare -
                                (currentRide.vehicleType === "bike" ? 25 : 60),
                            )}
                        </Text>
                    </View>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Payment Method</Text>
                        <View style={styles.cashBadge}>
                            <Ionicons name="cash-outline" size={12} color="#0F6E56" />
                            <Text style={styles.cashText}>Cash to Peer</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Route Info */}
                    <View style={styles.routeSection}>
                        <View style={styles.routeItem}>
                            <Ionicons name="radio-button-on" size={14} color="#0D9488" />
                            <Text style={styles.routeText} numberOfLines={1}>
                                {currentRide.pickup.title}
                            </Text>
                        </View>
                        <View style={styles.routeLineVertical} />
                        <View style={styles.routeItem}>
                            <Ionicons name="location" size={14} color="#EF4444" />
                            <Text style={styles.routeText} numberOfLines={1}>
                                {currentRide.destination.title}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Rider Review Box */}
                {currentRide.rider && (
                    <View style={styles.reviewCard}>
                        <Text style={styles.reviewTitle}>Rate your Peer Commuter</Text>
                        <View style={styles.riderRow}>
                            <Image
                                source={{ uri: currentRide.rider.avatarUrl }}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.riderName}>{currentRide.rider.name}</Text>
                                <Text style={styles.riderUni}>
                                    {currentRide.rider.university} Student (
                                    {currentRide.rider.vehicleModel})
                                </Text>
                            </View>
                        </View>

                        {/* Star Rating Selector */}
                        <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={32}
                                        color="#F59E0B"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Optional Peer Fuel Contribution Tips */}
                        <Text style={styles.tipLabel}>Add student fuel tip (optional)</Text>
                        <View style={styles.tipRow}>
                            {[10, 20, 30].map((tip) => (
                                <TouchableOpacity
                                    key={tip}
                                    style={[
                                        styles.tipBtn,
                                        selectedTip === tip && styles.tipBtnActive,
                                    ]}
                                    onPress={() =>
                                        setSelectedTip(selectedTip === tip ? null : tip)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.tipText,
                                            selectedTip === tip && styles.tipTextActive,
                                        ]}
                                    >
                                        +৳{tip}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Done / Continue Button */}
                <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={handleFinish}
                    activeOpacity={0.8}
                >
                    <Text style={styles.doneBtnText}>Back to CampusRide Home</Text>
                </TouchableOpacity>
            </ScrollView>
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
    },
    emptyText: {
        fontSize: 16,
        color: "#64748B",
        marginBottom: 16,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    successHeader: {
        alignItems: "center",
        marginVertical: 14,
    },
    checkCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#0D9488",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        elevation: 3,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#0D1F4E",
    },
    successSub: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 2,
    },
    receiptId: {
        fontSize: 11,
        color: "#94A3B8",
        fontWeight: "600",
        marginTop: 4,
    },
    receiptCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: 14,
    },
    fareHighlightRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalFareLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0D1F4E",
    },
    totalFareAmount: {
        fontSize: 24,
        fontWeight: "800",
        color: "#0D9488",
    },
    divider: {
        height: 1,
        backgroundColor: "#F1F5F9",
        marginVertical: 12,
    },
    breakdownRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    breakdownLabel: {
        fontSize: 13,
        color: "#64748B",
    },
    breakdownValue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1E293B",
    },
    cashBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#E1F5EE",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    cashText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#0F6E56",
    },
    routeSection: {
        gap: 6,
    },
    routeItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    routeLineVertical: {
        width: 2,
        height: 12,
        backgroundColor: "#CBD5E1",
        marginLeft: 6,
    },
    routeText: {
        fontSize: 12,
        color: "#334155",
        fontWeight: "500",
        flex: 1,
    },
    reviewCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 2,
        marginBottom: 18,
        alignItems: "center",
    },
    reviewTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0D1F4E",
        marginBottom: 12,
    },
    riderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
        alignSelf: "stretch",
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    riderName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0D1F4E",
    },
    riderUni: {
        fontSize: 11,
        color: "#64748B",
    },
    starRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 14,
    },
    tipLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: "#94A3B8",
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    tipRow: {
        flexDirection: "row",
        gap: 10,
    },
    tipBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        backgroundColor: "#F8FAFC",
    },
    tipBtnActive: {
        borderColor: "#0D9488",
        backgroundColor: "#F0FDFA",
    },
    tipText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#64748B",
    },
    tipTextActive: {
        color: "#0D9488",
    },
    doneBtn: {
        backgroundColor: "#0D9488",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    doneBtnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});
