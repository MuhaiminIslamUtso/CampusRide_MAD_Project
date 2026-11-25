import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import FormField from '@/components/form-field';

interface VerificationForm {
  studentId: string;
  department: string;
}

interface FormErrors {
  studentId?: string;
  department?: string;
}

export default function VerifyIdScreen() {
  const { state, submitVerification } = useAuth();
  const [formData, setFormData] = useState<VerificationForm>({
    studentId: state.user?.studentId || '22-47399-2',
    department: 'Computer Science',
  });
  const [idCardImage, setIdCardImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof VerificationForm, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const markTouched = (field: keyof VerificationForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // AIUB pattern: NN-NNNNN-N (regex check from Week 4 manual)
  useEffect(() => {
    const errs: FormErrors = {};
    const idPattern = /^\d{2}-\d{5}-\d$/;

    if (!formData.studentId.trim()) {
      errs.studentId = 'Student ID is required.';
    } else if (!idPattern.test(formData.studentId.trim())) {
      errs.studentId = 'Format must match AIUB pattern: NN-NNNNN-N (e.g. 22-47399-2)';
    }

    if (!formData.department.trim()) {
      errs.department = 'Department is required.';
    }

    setErrors(errs);
  }, [formData]);

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.studentId.length > 0 &&
    formData.department.length > 0 &&
    !!idCardImage;

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    setTouched({ studentId: true, department: true });

    if (!isFormValid || !idCardImage) {
      Alert.alert('Incomplete Verification', 'Please provide a valid Student ID and document photo.');
      return;
    }

    setIsSubmitting(true);
    await submitVerification(formData.studentId, formData.department, idCardImage);
    setIsSubmitting(false);

    Alert.alert(
      'Verification Submitted',
      'Your student identity is under review. You can now access CampusRide!',
      [
        {
          text: 'Open CampusRide',
          onPress: () => router.replace('/(tabs)/(home)'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Verification</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Verification Shield Banner */}
        <View style={styles.banner}>
          <Ionicons name="shield-checkmark" size={24} color="#0D9488" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>AIUB Institutional Verification</Text>
            <Text style={styles.bannerSub}>
              Ensure zero unauthorized riders on campus roads. Both passengers and riders must verify.
            </Text>
          </View>
        </View>

        {/* Verification Form */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Enter Student Credentials</Text>

          <FormField
            label="Official Student ID"
            placeholder="e.g. 22-47399-2"
            value={formData.studentId}
            onChangeText={(txt) => updateField('studentId', txt)}
            onBlur={() => markTouched('studentId')}
            autoCapitalize="none"
            error={touched.studentId || submitAttempted ? errors.studentId : undefined}
          />

          <FormField
            label="Department / Faculty"
            placeholder="e.g. Computer Science, FST"
            value={formData.department}
            onChangeText={(txt) => updateField('department', txt)}
            onBlur={() => markTouched('department')}
            error={touched.department || submitAttempted ? errors.department : undefined}
          />

          {/* Document Upload Simulation */}
          <Text style={styles.uploadLabel}>STUDENT ID CARD PHOTO</Text>

          {idCardImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: idCardImage }} style={styles.previewImage} />
              <View style={styles.imageOverlayBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.imageBadgeText}>ID Photo Attached</Text>
              </View>
              <TouchableOpacity
                style={styles.changePhotoBtn}
                onPress={() => setIdCardImage('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400')}
              >
                <Text style={styles.changePhotoText}>Replace Document</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() =>
                setIdCardImage('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400')
              }
            >
              <Ionicons name="camera-outline" size={32} color="#0D9488" />
              <Text style={styles.uploadBoxTitle}>Upload Front of University ID Card</Text>
              <Text style={styles.uploadBoxSub}>JPEG or PNG up to 5MB</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, (!isFormValid || isSubmitting) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit ID for Verification</Text>
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
    alignItems: 'flex-start',
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
    fontSize: 12,
    color: '#0F6E56',
    marginTop: 2,
    lineHeight: 17,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1F4E',
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 6,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D1F4E',
    marginTop: 8,
  },
  uploadBoxSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: 160,
    opacity: 0.9,
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F6E56',
  },
  changePhotoBtn: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
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
