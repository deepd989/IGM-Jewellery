import { CartItem, OrderDetails } from '@/interfaces/order-details.interface';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
import { CheckoutStepper } from '../../components/checkout/CheckoutStepper';
import { CheckoutSummary } from '../../components/checkout/CheckoutSummary';
import { COLORS, SPACING } from '../../constants/theme';
import { Brand } from '../../enums/brand.enum';
import { ProductType } from '../../enums/productType.enum';



const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  street: z.string().min(5, 'Please enter a valid street address'),
  landmark: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Pincode must be numeric'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().length(10, 'Phone must be 10 digits').regex(/^\d+$/, 'Phone must be numeric'),
  email: z.string().email('Invalid email address'),
  billingSameAsShipping: z.boolean().default(true),
  whatsappUpdates: z.boolean().default(true),
});

type AddressFormData = z.infer<typeof addressSchema>;

// --- DUMMY DATA (Normally from Redux) ---
const DUMMY_CART_ITEMS: CartItem[] = [
  {
    product: {
      id: '1',
      title: '24K Diamond Ring',
      name: 'Solitaire Shine',
      description: 'Elegant ring',
      productType: ProductType.Ring,
      givenPrice: 25000,
      discountedPrice: 20000,
      brand: Brand.Kalyan,
      thumbnailUrls: ['https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=400'],
      tags: [],
      rating: 5
    },
    quantity: 1,
    selectedSize: '12'
  },
  {
    product: {
      id: '2',
      title: 'Gold Plated Necklace',
      name: 'Luxe Chain',
      description: 'Stunning piece',
      productType: ProductType.Necklace,
      givenPrice: 150000,
      discountedPrice: 130000,
      brand: Brand.Malabar,
      thumbnailUrls: ['https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400'],
      tags: [],
      rating: 4
    },
    quantity: 1,
    selectedSize: 'One Size'
  }
];

export default function AddressScreen() {
  const router = useRouter();

  // --- CALCULATE DYNAMIC TOTALS ---
  const orderDetails = useMemo<OrderDetails>(() => {
    const subtotal = DUMMY_CART_ITEMS.reduce((acc, item) => acc + (item.product.givenPrice * item.quantity), 0);
    const sellingPrice = DUMMY_CART_ITEMS.reduce((acc, item) => acc + (item.product.discountedPrice * item.quantity), 0);
    const savings = subtotal - sellingPrice;
    const platformFee = 220;
    const total = sellingPrice + platformFee;

    return {
      items: DUMMY_CART_ITEMS,
      subtotal,
      savings,
      platformFee,
      total,
    };
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      street: '',
      landmark: '',
      city: 'Mumbai',
      pincode: '400066',
      state: 'Maharashtra',
      country: 'India',
      phone: '9870951994',
      email: 'useremail@gmail.com',
      billingSameAsShipping: true,
      whatsappUpdates: true,
    }
  });

  const [billingOption, setBillingOption] = useState<'same' | 'different'>('same');

  const onSubmit = (data: AddressFormData) => {
    console.log('Address Validated & Saved:', data);
    // router.push('/checkout/gifting'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Address</Text>
          <View style={{ width: 40 }} />
        </View>

        <CheckoutStepper currentStep="Address" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <CheckoutSummary order={orderDetails} />

          <View style={styles.existingAddressCard}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressTitle}>Deliver to Saved Address</Text>
              <Ionicons name="checkbox" size={20} color="#000" />
            </View>
            <Text style={styles.addressText}>
              Shop Number 201, Avon Enclave, Andheri East, Mumbai 400 066
            </Text>
            <Text style={styles.contactRow}>+91 9870951994    emailid@gmail.com</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Add New Address</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        style={[styles.input, errors.firstName && styles.inputError]} 
                        placeholder="First Name" 
                        value={value} 
                        onChangeText={onChange} 
                      />
                      {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
                    </View>
                  )}
                />
              </View>
              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        style={[styles.input, errors.lastName && styles.inputError]} 
                        placeholder="Last Name" 
                        value={value} 
                        onChangeText={onChange} 
                      />
                      {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
                    </View>
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="street"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput 
                    style={[styles.input, errors.street && styles.inputError]} 
                    placeholder="Street & House Number" 
                    value={value} 
                    onChangeText={onChange} 
                  />
                  {errors.street && <Text style={styles.errorText}>{errors.street.message}</Text>}
                </View>
              )}
            />

            <Controller
              control={control}
              name="landmark"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={styles.input} 
                  placeholder="Landmark (optional)" 
                  value={value} 
                  onChangeText={onChange} 
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { value } }) => (
                    <View style={styles.dropdownInput}>
                      <Text style={styles.dropdownLabel}>City</Text>
                      <Text style={styles.dropdownValue}>{value}</Text>
                      <Ionicons name="chevron-down" size={16} color="#000" />
                    </View>
                  )}
                />
              </View>
              <View style={styles.halfWidth}>
                <Controller
                  control={control}
                  name="pincode"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        style={[styles.input, errors.pincode && styles.inputError]} 
                        placeholder="Pincode" 
                        value={value} 
                        onChangeText={onChange} 
                        keyboardType="numeric"
                        maxLength={6}
                      />
                      {errors.pincode && <Text style={styles.errorText}>{errors.pincode.message}</Text>}
                    </View>
                  )}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.row}>
              <View style={styles.phonePrefix}>
                <TextInput style={styles.input} value="+91" editable={false} />
              </View>
              <View style={styles.phoneNumber}>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        style={[styles.input, errors.phone && styles.inputError]} 
                        placeholder="Phone Number" 
                        value={value} 
                        onChangeText={onChange} 
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                    </View>
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View style={[styles.emailInputContainer, errors.email && styles.inputError]}>
                    <Text style={styles.emailLabel}>Email</Text>
                    <TextInput 
                      style={styles.emailInput} 
                      value={value} 
                      onChangeText={onChange} 
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>
              )}
            />

            <Text style={styles.sectionTitle}>Billing Address</Text>
            <TouchableOpacity 
              style={styles.radioOption} 
              onPress={() => setBillingOption('same')}
            >
              <Text style={styles.radioText}>Same as Shipping Address</Text>
              <Ionicons 
                name={billingOption === 'same' ? "radio-button-on" : "radio-button-off"} 
                size={22} 
                color="#000" 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.radioOption} 
              onPress={() => setBillingOption('different')}
            >
              <Text style={styles.radioText}>Use a different billing address</Text>
              <Ionicons 
                name={billingOption === 'different' ? "radio-button-on" : "radio-button-off"} 
                size={22} 
                color="#000" 
              />
            </TouchableOpacity>

            <View style={styles.whatsappContainer}>
              <Ionicons name="checkbox" size={20} color="#000" />
              <Text style={styles.whatsappText}>Receive updates on Whatsapp</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerPriceCol}>
            <View style={styles.footerPriceRow}>
              <Text style={styles.totalPayable}>₹{orderDetails.total.toLocaleString()}</Text>
              <Text style={styles.oldPayable}>₹{orderDetails.subtotal.toLocaleString()}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewSummaryText}>VIEW ORDER SUMMARY</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.saveBtnText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
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
  scrollContent: {
    paddingBottom: 120,
  },
  existingAddressCard: {
    margin: SPACING.m,
    padding: SPACING.m,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
    marginBottom: 12,
  },
  contactRow: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  formContainer: {
    paddingHorizontal: SPACING.m,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 13,
    marginBottom: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 10,
    color: COLORS.error,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dropdownInput: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 6,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  phonePrefix: {
    width: 60,
  },
  phoneNumber: {
    flex: 1,
  },
  emailInputContainer: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 12,
  },
  emailInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  radioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
  },
  radioText: {
    fontSize: 14,
    color: '#444',
  },
  whatsappContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  whatsappText: {
    fontSize: 13,
    marginLeft: 8,
    color: '#444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  footerPriceCol: {
    flex: 1,
  },
  footerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  totalPayable: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },
  oldPayable: {
    fontSize: 13,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  viewSummaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
    textDecorationLine: 'underline',
  },
  saveBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 6,
    minWidth: 160,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});