import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiderAdmin } from '@/context/rider-admin-context';
import FormField from '@/components/form-field';

interface VehicleForm {
  vehicleType: 'bike' | 'car';
  vehicleModel: string;
  vehiclePlate: string;
  drivingLicenseNo: string;
}

interface FormErrors {
  vehicleModel?: string;
  vehiclePlate?: string;
  drivingLicenseNo?: string;
}

export default function VehicleRegisterScreen() {
  const { registerVehicle } = useRiderAdmin();
  const [vehicleType, setVehicleType] = useState<'bike' | 'car'>('bike');
  const [formData, setFormData] = useState<VehicleForm>({
    vehicleType: 'bike',
    vehicleModel: 'Yamaha FZS V3 (Dark Knight)',
    vehiclePlate: 'DHAKA METRO HA-4521',
    drivingLicenseNo: 'DL-DH-2024-88419',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docsUploaded, setDocsUploaded] = useState(true);

  const updateField = (field: keyof VehicleForm, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const markTouched = (field: keyof VehicleForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Live validation on keystroke (Week 4 pattern)
  useEffect(() => {
    const errs: FormErrors = {};
    if (!formData.vehicleModel.trim()) {
      errs.vehicleModel = 'Vehicle model/brand is required.';
    } else if (formData.vehicleModel.length < 3) {
      errs.vehicleModel = 'Model must be at least 3 characters.';
    }

    if (!formData.vehiclePlate.trim()) {
      errs.vehiclePlate = 'License plate is required (e.g. DHAKA METRO HA-4521).';
    }

    if (!formData.drivingLicenseNo.trim()) {
      errs.drivingLicenseNo = 'BRTA Driving License number is required.';
    }
    setErrors(errs);
  }, [formData]);

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.vehicleModel.length > 0 &&
    formData.vehiclePlate.length > 0 &&
    formData.drivingLicenseNo.length > 0;

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    setTouched({
      vehicleModel: true,
      vehiclePlate: true,
      drivingLicenseNo: true,
    });

    if (!isFormValid || !docsUploaded) {
      Alert.alert('Incomplete', 'Please fill all vehicle details and upload documents.');
      return;
    }

    setIsSubmitting(true);
    await registerVehicle({
      vehicleType,
      vehicleModel: formData.vehicleModel.trim(),
      vehiclePlate: formData.vehiclePlate.trim().toUpperCase(),
      drivingLicenseNo: formData.drivingLicenseNo.trim().toUpperCase(),
      documentsUploaded: true,
      approvalStatus: 'APPROVED',
    });
    setIsSubmitting(false);

    Alert.alert(
      'Vehicle Approved! 🛵',
      'Your vehicle has been registered and approved for campus rides.',
      [{ text: 'Go to Rider Dashboard', onPress: () => router.replace('/(tabs)/(rider)' as any) }]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rider & Vehicle Registration</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Info Banner */}
        <View style={styles.banner}>
          <Ionicons name="bicycle" size={24} color="#0D9488" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Share Your Campus Commute</Text>
            <Text style={styles.bannerSub}>
              Register your bike or car to share fuel costs with fellow university students.
            </Text>
          </View>
        </View>

        {/* Vehicle Type Selection */}
        <Text style={styles.sectionTitle}>SELECT VEHICLE TYPE</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, vehicleType === 'bike' && styles.typeBtnActive]}
            onPress={() => setVehicleType('bike')}
          >
            <Ionicons
              name="bicycle"
              size={22}
              color={vehicleType === 'bike' ? '#0D9488' : '#64748B'}
            />
            <Text style={[styles.typeText, vehicleType === 'bike' && styles.typeTextActive]}>
              Motorbike
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, vehicleType === 'car' && styles.typeBtnActive]}
            onPress={() => setVehicleType('car')}
          >
            <Ionicons
              name="car"
              size={22}
              color={vehicleType === 'car' ? '#0D9488' : '#64748B'}
            />
            <Text style={[styles.typeText, vehicleType === 'car' && styles.typeTextActive]}>
              Private Car
            </Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Vehicle & License Details</Text>

          <FormField
            label="Vehicle Model & Color"
            placeholder="e.g. Yamaha FZS V3 (Black)"
            value={formData.vehicleModel}
            onChangeText={(txt) => updateField('vehicleModel', txt)}
            onBlur={() => markTouched('vehicleModel')}
            error={touched.vehicleModel || submitAttempted ? errors.vehicleModel : undefined}
          />

          <FormField
            label="License Plate Number"
            placeholder="e.g. DHAKA METRO HA-4521"
            value={formData.vehiclePlate}
            onChangeText={(txt) => updateField('vehiclePlate', txt)}
            onBlur={() => markTouched('vehiclePlate')}
            autoCapitalize="characters"
            error={touched.vehiclePlate || submitAttempted ? errors.vehiclePlate : undefined}
          />

          <FormField
            label="BRTA Driving License Number"
            placeholder="e.g. DL-DH-2024-88419"
            value={formData.drivingLicenseNo}
            onChangeText={(txt) => updateField('drivingLicenseNo', txt)}
            onBlur={() => markTouched('drivingLicenseNo')}
            autoCapitalize="characters"
            error={touched.drivingLicenseNo || submitAttempted ? errors.drivingLicenseNo : undefined}
          />

          {/* Document Upload Box */}
          <Text style={styles.docLabel}>DRIVING LICENSE & SMART CARD PHOTO</Text>
          <TouchableOpacity
            style={styles.docBox}
            onPress={() => setDocsUploaded(!docsUploaded)}
          >
            <Ionicons
              name={docsUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
              size={24}
              color={docsUploaded ? '#10B981' : '#0D9488'}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.docBoxTitle}>
                {docsUploaded ? 'License Attached (Ready for Admin)' : 'Tap to Upload Documents'}
              </Text>
              <Text style={styles.docBoxSub}>Scanned BRTA driving license</Text>
            </View>
            <Ionicons name="checkbox" size={20} color={docsUploaded ? '#0D9488' : '#CBD5E1'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, (!isFormValid || isSubmitting) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Vehicle for Approval</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E1F5EE',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D1F4E',
  },
  bannerSub: {
    fontSize: 11,
    color: '#0F6E56',
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  typeBtnActive: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  typeTextActive: {
    color: '#0D9488',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1F4E',
    marginBottom: 14,
  },
  docLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 6,
  },
  docBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  docBoxTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D1F4E',
  },
  docBoxSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  submitBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
