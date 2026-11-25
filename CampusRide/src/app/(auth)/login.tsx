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
import { useAuth } from '@/context/auth-context';
import FormField from '@/components/form-field';

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof LoginForm, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const markTouched = (field: keyof LoginForm) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Live validation on keystroke (Week 4 pattern)
  useEffect(() => {
    const errs: FormErrors = {};
    if (!formData.email.trim()) {
      errs.email = 'University email or student ID is required.';
    } else if (!formData.email.includes('@') && formData.email.length < 5) {
      errs.email = 'Enter a valid institutional email (e.g. @student.aiub.edu).';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0 && formData.email.length > 0 && formData.password.length > 0;

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      setIsSubmitting(false);
      // Navigate to University selection on first login / register
      router.push('/(auth)/university-select');
    } catch {
      setIsSubmitting(false);
      Alert.alert('Login Failed', 'Please verify your credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Brand Banner */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="school" size={32} color="#0D9488" />
          </View>
          <Text style={styles.brandTitle}>CampusRide</Text>
          <Text style={styles.brandSub}>Secure University Student Commute</Text>
        </View>

        {/* Card Container */}
        <View style={styles.card}>
          <Text style={styles.heading}>Sign In to Your Account</Text>
          <Text style={styles.subheading}>
            Connect with verified peers for safe bike and car commutes.
          </Text>

          <FormField
            label="Institutional Email / Student ID"
            placeholder="e.g. 22-47399-2@student.aiub.edu"
            value={formData.email}
            onChangeText={(txt) => updateField('email', txt)}
            onBlur={() => markTouched('email')}
            autoCapitalize="none"
            keyboardType="email-address"
            error={touched.email || submitAttempted ? errors.email : undefined}
          />

          <FormField
            label="Password"
            placeholder="Enter secure password"
            value={formData.password}
            onChangeText={(txt) => updateField('password', txt)}
            onBlur={() => markTouched('password')}
            secureTextEntry
            autoCapitalize="none"
            error={touched.password || submitAttempted ? errors.password : undefined}
          />

          {/* Quick AIUB Student Auto-Fill (Dev Convenience) */}
          <TouchableOpacity
            style={styles.quickFillBtn}
            onPress={() => {
              setFormData({
                email: '22-47399-2@student.aiub.edu',
                password: 'password123',
              });
            }}
          >
            <Ionicons name="flash-outline" size={14} color="#0D9488" />
            <Text style={styles.quickFillText}>Auto-fill AIUB student credentials</Text>
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
              <Text style={styles.submitBtnText}>Sign In with Student ID</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.replace('/(tabs)/(home)')}
        >
          <Text style={styles.skipBtnText}>Continue to Ride Dashboard →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0D1F4E',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D1F4E',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 18,
    lineHeight: 18,
  },
  quickFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  quickFillText: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  skipBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipBtnText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
});
