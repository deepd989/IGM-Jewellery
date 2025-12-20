import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as z from 'zod';
import { CheckoutStepper } from '../../../components/checkout/CheckoutStepper';
import { SPACING } from '../../../constants/theme';

// Fixed: Removed .default() from schema to avoid type mismatch with react-hook-form resolver
const cardSchema = z.object({
  cardNumber: z.string().length(16, 'Card number must be 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvv: z.string().length(3, 'CVV must be 3 digits'),
  nameOnCard: z.string().min(2, 'Name is required'),
  nickname: z.string().optional(),
  remember: z.boolean(),
});

type CardFormData = z.infer<typeof cardSchema>;

export default function CardDetailsScreen() {
  const router = useRouter();
  
  // Fixed: defaultValues property handles the initial state to match schema requirements
  const { control, handleSubmit, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { 
      cardNumber: '', 
      expiry: '', 
      cvv: '', 
      nameOnCard: '', 
      nickname: '', 
      remember: true 
    }
  });

  const onSubmit = (data: CardFormData) => {
    console.log('Card Data:', data);
    router.push('/checkout/confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Card Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Payment" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.summaryStub}>
            <Text style={styles.stubText}>Show Order Summary</Text>
            <Text style={styles.stubValue}>4 items  ₹20,000</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Enter Card Details</Text>
            
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, errors.cardNumber && styles.inputError]} 
                  placeholder="Card Number|" 
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  maxLength={16}
                />
              )}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}

            <View style={styles.row}>
              <View style={{ flex: 2 }}>
                <Controller
                  control={control}
                  name="expiry"
                  render={({ field: { onChange, value } }) => (
                    <TextInput 
                      style={[styles.input, errors.expiry && styles.inputError]} 
                      placeholder="Valid Through (MM/YY)" 
                      value={value}
                      onChangeText={onChange}
                      maxLength={5}
                    />
                  )}
                />
                {errors.expiry && <Text style={styles.errorText}>{errors.expiry.message}</Text>}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Controller
                  control={control}
                  name="cvv"
                  render={({ field: { onChange, value } }) => (
                    <TextInput 
                      style={[styles.input, errors.cvv && styles.inputError]} 
                      placeholder="CVV" 
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                    />
                  )}
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv.message}</Text>}
              </View>
            </View>

            <Controller
              control={control}
              name="nameOnCard"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={[styles.input, errors.nameOnCard && styles.inputError]} 
                  placeholder="Name on the Card" 
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.nameOnCard && <Text style={styles.errorText}>{errors.nameOnCard.message}</Text>}

            <Controller
              control={control}
              name="nickname"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={styles.input} 
                  placeholder="Nickname (optional)" 
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="remember"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity 
                  style={styles.checkboxRow} 
                  onPress={() => onChange(!value)}
                >
                  <Ionicons 
                    name={value ? "checkbox" : "square-outline"} 
                    size={20} 
                    color="#000" 
                  />
                  <Text style={styles.checkboxText}>Remember for future transactions</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.submitBtnText}>Verify & Pay ₹20,000</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryStub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stubText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stubValue: {
    fontSize: 14,
  },
  formSection: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    height: 54,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: '#000',
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  }
});