import BrandProfile from '@/components/brands/brandSite';
import { useGetBrandByNameQuery } from '@/store/apis/brands';
import { useLocalSearchParams } from 'expo-router';

export default function BrandDetailPage() {
  const { brandName } = useLocalSearchParams<{ brandName: string }>();
  const { data: brand, isLoading, error } = useGetBrandByNameQuery(brandName);

  if (isLoading) return <div>Loading...</div>;
  if (error || !brand) return <div>Brand not found.</div>;

  return (
    <BrandProfile
      header={{
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
  );
}