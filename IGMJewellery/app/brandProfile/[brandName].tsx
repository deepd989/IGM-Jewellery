import BrandProfile from '@/components/brands/brandSite';
import { useGetBrandByNameQuery } from '@/store/apis/brandsApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function BrandDetailPage() {
  const router = useRouter();
  const { brandName } = useLocalSearchParams<{ brandName: string }>();
  console.log("BrandDetailPage rendered",brandName);
  const { data: brand, isLoading, error } = useGetBrandByNameQuery(brandName);

  if (error || !brand) return <></>

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backText}>‹</Text>
      </Pressable>

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
    </View>
  );
}

const styles = StyleSheet.create({
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