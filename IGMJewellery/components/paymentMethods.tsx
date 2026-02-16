import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function PaymentMethods() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>We Accept</Text>
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>PhonePe</Text>
        </View>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>GPay</Text>
        </View>
        <View style={styles.logoBox}>
          <Ionicons name="card-outline" size={20} color="#1434CB" />
          <Text style={styles.logoText}>Amex</Text>

        </View>
        <View style={styles.logoBox}>
          <Ionicons name="card-outline" size={20} color="#EB001B" />
          <Text style={styles.logoText}>Mastercard</Text>
        </View>
        <View style={styles.logoBox}>
          <Ionicons name="card-outline" size={20} c     olor="#006FCF" />
          <Text style={styles.logoText}>Visa</Text>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 16,
    fontWeight: '500',
  },
  logoRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  logoBox: {
    width: 55,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  logoText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.text,
  },
});