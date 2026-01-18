import BrandProfile from '@/components/brands/brandSite';
import { CartBadge } from '@/components/cart/CardBadge';
import { COLORS, SPACING } from '@/constants/theme';
import { useGetBrandByNameQuery } from '@/store/apis/brandsApi';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrandDetailPage() {
  const router = useRouter();
  const { brandName } = useLocalSearchParams<{ brandName: string }>();
  console.log("BrandDetailPage rendered",brandName);
  const { data: brand, isLoading, error } = useGetBrandByNameQuery(brandName);

  if (error || !brand) return <></>

  return (
    <SafeAreaView style={{ flex: 1 }}>
       <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
                      </TouchableOpacity>
              <Text style={styles.headerTitle}>Brands</Text>
              <View style={styles.headerIcons}>
                {/* <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity> */}
                 <View style={styles.iconBtn}>
                  <CartBadge iconSize={24} iconColor={COLORS.primary} />
                </View>
              </View>
            </View>

      <BrandProfile
        header={{
          brandNameKey: brand.businessNameKey,
          profileImageUri: brand.profileImageUri,
          businessName: brand.businessName,
          tagline: brand.tagline,
          ratingText: brand.ratingText,
          storeButtonLabel: brand.storeButtonLabel,
          onEnterStore: () => console.log('Enter Store'),
        }}
        tabs={['About', 'Products', 'Community']}
        initialActiveTab="About"
        heroImageUri="https://example.com/hero.jpg"
        aboutSections={brand.aboutSections}
        stats={brand.stats}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SPACING.m,
      paddingVertical: SPACING.s,
      backgroundColor: COLORS.background,
      paddingTop: SPACING.l,
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
  backButton: {
    position: 'absolute',
    top: 50, // adjust for notch/status bar as needed
    left: 16,
    zIndex: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black',
  },
});