import { useRiderAdmin } from "@/context/rider-admin-context";
import { IncidentReport } from "@/data/rider-admin";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedbackIncidentScreen() {
  const { state, submitReport } = useRiderAdmin();
  const [rating, setRating] = useState(5);
  const [category, setCategory] =
    useState<IncidentReport["category"]>("SAFETY");
  const [reporteeName, setReporteeName] = useState("Tanvir Ahmed (Yamaha FZS)");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Required", "Please enter feedback or incident remarks.");
      return;
    }

    setIsSubmitting(true);
    const newReport: IncidentReport = {
      id: "rep-" + Date.now().toString().slice(-4),
      rideId: "CR-" + Math.floor(10000 + Math.random() * 90000),
      reportedBy: "22-47940-2 (Farhaz)",
      reporteeName,
      category,
      rating,
      description: description.trim(),
      submittedAt: "Just now",
      resolved: false,
    };

    await submitReport(newReport);
    setIsSubmitting(false);
    setDescription("");

    Alert.alert(
      "Feedback Recorded",
      "Thank you for reporting. Your input helps keep CampusRide secure and student-friendly.",
      [{ text: "OK" }],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ratings & Incident Center</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Reporting Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Submit Trip Feedback / Report</Text>
          <Text style={styles.cardSub}>
            Report reckless driving, vehicle condition, or praise a great peer
            commuter.
          </Text>

          {/* Peer / Rider Target */}
          <Text style={styles.inputLabel}>STUDENT COMMUTER / RIDER</Text>
          <TextInput
            style={styles.textInput}
            value={reporteeName}
            onChangeText={setReporteeName}
            placeholder="Name or Vehicle Plate"
          />

          {/* Category Pills */}
          <Text style={styles.inputLabel}>REPORT CATEGORY</Text>
          <View style={styles.categoryRow}>
            {(
              [
                "SAFETY",
                "OVERCHARGING",
                "BEHAVIOR",
                "VEHICLE_CONDITION",
              ] as const
            ).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, category === cat && styles.catBtnActive]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.catBtnText,
                    category === cat && styles.catBtnTextActive,
                  ]}
                >
                  {cat.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Star Rating */}
          <Text style={styles.inputLabel}>EXPERIENCE RATING</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={28}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Incident Description */}
          <Text style={styles.inputLabel}>DETAILS & REMARKS</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what occurred during the trip..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Safety Feedback</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Community Logs Section */}
        <Text style={styles.sectionHeader}>
          RECENT SAFETY LOGS ({state.incidentReports.length})
        </Text>
        {state.incidentReports.map((item) => (
          <View key={item.id} style={styles.logCard}>
            <View style={styles.logHeader}>
              <View style={styles.logCatBadge}>
                <Text style={styles.logCatText}>{item.category}</Text>
              </View>
              <View style={styles.starMiniRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.starMiniText}>{item.rating}.0</Text>
              </View>
            </View>
            <Text style={styles.logReportee}>Target: {item.reporteeName}</Text>
            <Text style={styles.logDesc}>"{item.description}"</Text>
            <View style={styles.logFooter}>
              <Text style={styles.logTime}>
                {item.submittedAt} • Ride {item.rideId}
              </Text>
              <Text style={styles.resolvedBadge}>
                {item.resolved
                  ? "✓ Reviewed by Admin"
                  : "⏳ Under Investigation"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0D1F4E",
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    marginBottom: 20,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D1F4E",
  },
  cardSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  catBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  catBtnActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  catBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  catBtnTextActive: {
    color: "#FFFFFF",
  },
  starRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  submitBtnDisabled: {
    backgroundColor: "#94A3B8",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  logCatBadge: {
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  logCatText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0D9488",
  },
  starMiniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starMiniText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0D1F4E",
  },
  logReportee: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0D1F4E",
  },
  logDesc: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
    fontStyle: "italic",
  },
  logFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  logTime: {
    fontSize: 10,
    color: "#94A3B8",
  },
  resolvedBadge: {
    fontSize: 10,
    fontWeight: "600",
    color: "#0F6E56",
  },
});
