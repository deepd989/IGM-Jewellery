import BrandsExploreAll from "@/components/brands/brandExploreAll";
import BrandList from "@/components/brands/brandList";
import BrandProfile from "@/components/brands/brandSite";

export default function Brands() {
    return (<>
    {/* <BrandList/> */}
    {/* <BrandsExploreAll/> */}
    <BrandProfile
  header={{
    profileImageUri: 'https://example.com/profile.jpg',
    businessName: 'Kalyan Jewellers',
    tagline: 'When you gift jewellery you achieve immortality in their heart.',
    ratingText: '5.0 ★ (11k+)',
    storeButtonLabel: 'Enter Virtual Store',
    onEnterStore: () => console.log('Enter Store'),
  }}
  tabs={['About', 'Products', 'Community']}
  initialActiveTab="About"
  heroImageUri="https://example.com/hero.jpg"
  aboutSections={[
    {
      title: 'The Hub of Indian Culture & Heritage',
      paragraphs: [
        'We are one of the oldest business families in India with a family legacy of over a century in business, starting from as early as 1908.',
        'Started for the noble cause of nation-building and self-sustenance in a pre-independent India, the forefathers believed ethical, honest and transparent business practices should form the foundation of the group.',
      ],
    },
  ]}
  stats={[
    { label: 'Founded in', value: '1994' },
    { label: 'No. of stores', value: '40+' },
    { label: 'No. of cities', value: '74+' },
  ]}
/>
    </>)
}