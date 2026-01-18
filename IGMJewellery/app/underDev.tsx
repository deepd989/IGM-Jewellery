import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CartBadge } from '@/components/cart/CardBadge';
import { COLORS, SPACING } from '@/constants/theme';

export default function UnderDev() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const featureName = params.featureName || 'Feature';


  return (
    <SafeAreaView style={{ flex: 1 }}>
       <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
                      </TouchableOpacity>
              <Text style={styles.headerTitle}></Text>
              <View style={styles.headerIcons}>
                {/* <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity> */}
                 <View style={styles.iconBtn}>
                  {/* <CartBadge iconSize={24} iconColor={COLORS.primary} /> */}
                </View>
              </View>
            </View>
    <View style={styles.container}>
      
      <Text style={styles.title}>Coming Soon</Text>
      <Text style={styles.subtitle}>
        {featureName} is launching soon!
      </Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.m,
      paddingVertical: SPACING.s,
      backgroundColor: COLORS.background,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.primary,
    },
    headerIcons: {
      flexDirection: 'row',
    },
    iconBtn: {
      marginLeft: SPACING.m,
    },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});