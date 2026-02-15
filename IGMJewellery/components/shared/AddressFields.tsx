import { AddressFormData } from '@/validation-schema/address-schema';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';


interface AddressFieldsProps {
  control: Control<AddressFormData>;
  errors: FieldErrors<AddressFormData>;
  showContactInfo?: boolean;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({ control, errors, showContactInfo = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.half}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <TextInput 
                style={[styles.input, errors.firstName && styles.errorInput]} 
                placeholder="First Name" 
                value={value} 
                onChangeText={onChange} 
              />
            )}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
        </View>
        <View style={styles.half}>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextInput 
                style={[styles.input, errors.lastName && styles.errorInput]} 
                placeholder="Last Name" 
                value={value} 
                onChangeText={onChange} 
              />
            )}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
        </View>
      </View>

      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, value } }) => (
          <TextInput 
            style={[styles.input, errors.street && styles.errorInput]} 
            placeholder="Street & House Number" 
            value={value} 
            onChangeText={onChange} 
          />
        )}
      />
      {errors.street && <Text style={styles.errorText}>{errors.street.message}</Text>}

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
        <View style={styles.half}>
          <Controller
            control={control}
            name="city"
            render={({ field: { value } }) => (
              <View style={[styles.dropdown, errors.city && styles.errorInput]}>
                <Text style={styles.dropLabel}>City</Text>
                <Text style={styles.dropValue}>{value || 'Mumbai'}</Text>
                <Ionicons name="chevron-down" size={14} color="#053844" />
              </View>
            )}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
        </View>
        <View style={styles.half}>
          <Controller
            control={control}
            name="pincode"
            render={({ field: { onChange, value } }) => (
              <TextInput 
                style={[styles.input, errors.pincode && styles.errorInput]} 
                placeholder="Pincode" 
                value={value} 
                onChangeText={onChange} 
                keyboardType="numeric"
                maxLength={6}
              />
            )}
          />
          {errors.pincode && <Text style={styles.errorText}>{errors.pincode.message}</Text>}
        </View>
      </View>

      {/* Controller registration for hidden fields ensures Zod validation passes */}
      <Controller control={control} name="state" render={() => <></>} />
      <Controller control={control} name="country" render={() => <></>} />

      {showContactInfo && (
        <>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.row}>
            <View style={styles.prefix}>
              <Text>+91</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    style={[styles.input, errors.phone && styles.errorInput]} 
                    placeholder="Phone Number" 
                    value={value} 
                    onChangeText={onChange} 
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                )}
              />
            </View>
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={[styles.emailBox, errors.email && styles.errorInput]}>
                <Text style={styles.emailLabel}>Email</Text>
                <TextInput 
                  style={styles.emailInput} 
                  value={value} 
                  onChangeText={onChange} 
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  input: { height: 50, backgroundColor: '#F5F5F5', borderRadius: 4, paddingHorizontal: 12, fontSize: 13 },
  errorInput: { borderWidth: 1, borderColor: 'red' },
  errorText: { color: 'red', fontSize: 10, marginTop: 2 },
  dropdown: { height: 50, backgroundColor: '#F5F5F5', borderRadius: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  dropLabel: { fontSize: 11, color: '#8E8E93', marginRight: 8 },
  dropValue: { flex: 1, fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  prefix: { width: 50, height: 50, backgroundColor: '#F5F5F5', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  emailBox: { height: 50, backgroundColor: '#F5F5F5', borderRadius: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  emailLabel: { fontSize: 11, color: '#8E8E93', marginRight: 12 },
  emailInput: { flex: 1, fontSize: 13, fontWeight: '600' }
});