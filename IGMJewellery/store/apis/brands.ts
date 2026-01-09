import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BrandAboutSection {
  title: string;
  paragraphs: string[];
}

export interface BrandStat {
  label: string;
  value: string;
  imageUri: string;
}

export interface Brand {
  bwThumbnailUri: string;  
  profileImageUri: string;
  businessNameKey: string; // optional key for internal use
  businessName: string; // used as unique key
  tagline: string;
  ratingText: string;
  storeButtonLabel: string;
  aboutSections: BrandAboutSection[];
  stats: BrandStat[];
}

// Mock brands data
const MOCK_BRANDS: Brand[] = [
  {
    profileImageUri: 'https://example.com/images/brands/kalyan.jpg',
    businessNameKey: 'kalyan_jewellers',
    businessName: 'Kalyan Jewellers',
    tagline: 'Trusted legacy in gold and diamonds',
    ratingText: '4.7 · 12k reviews',
    storeButtonLabel: 'Visit Store',
    aboutSections: [
      {
        title: 'Our Heritage',
        paragraphs: [
          'Kalyan Jewellers has been crafting fine jewelry for decades.',
          'We blend tradition with modern designs to suit every occasion.',
        ],
      },
      {
        title: 'Craftsmanship',
        paragraphs: [
          'Every piece is meticulously designed and inspected.',
          'Sourcing ethical materials is core to our values.',
        ],
      },
    ],
    stats: [
      { label: 'Stores', value: '150+' },
      { label: 'Established', value: '1993' },
      { label: 'Countries', value: '3' },
    ],
  },
  {
    businessNameKey: 'tanishq',
    profileImageUri: 'https://example.com/images/brands/tanishq.jpg',
    businessName: 'Tanishq',
    tagline: 'Elegance for every moment',
    ratingText: '4.8 · 18k reviews',
    storeButtonLabel: 'Shop Tanishq',
    aboutSections: [
      {
        title: 'Design Philosophy',
        paragraphs: [
          'We create timeless designs for modern lifestyles.',
          'Quality and authenticity are non-negotiable.',
        ],
      },
    ],
    stats: [
      { label: 'Stores', value: '200+' },
      { label: 'Established', value: '1994' },
      { label: 'Awards', value: '50+' },
    ],
  },
  {
    businessNameKey: 'caratlane',
    profileImageUri: 'https://example.com/images/brands/caratlane.jpg',
    businessName: 'CaratLane',
    tagline: 'Everyday fine jewelry',
    ratingText: '4.6 · 9k reviews',
    storeButtonLabel: 'Explore CaratLane',
    aboutSections: [
      {
        title: 'Mission',
        paragraphs: [
          'Make beautiful jewelry accessible and affordable.',
        ],
      },
    ],
    stats: [
      { label: 'Online Collections', value: '1,000+' },
      { label: 'Established', value: '2008' },
      { label: 'Cities', value: '40+' },
    ],
  },
];

interface BrandsQueryParams {
  searchQuery?: string;
}

// RTK Query API for brands
export const brandsApiService = createApi({
  reducerPath: 'brands',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    // Get all brands, optional search by name/tagline
    getBrands: builder.query<Brand[], BrandsQueryParams | void>({
      queryFn: (params) => {
        let brands = [...MOCK_BRANDS];

        if (params?.searchQuery) {
          const q = params.searchQuery.toLowerCase();
          brands = brands.filter(
            b =>
              b.businessName.toLowerCase().includes(q) ||
              b.tagline.toLowerCase().includes(q) ||
              b.ratingText.toLowerCase().includes(q)
          );
        }

        return { data: brands };
      },
    }),

    // Get a single brand by businessName
    getBrandByName: builder.query<Brand, string>({
      queryFn: (name) => {
        const brand = MOCK_BRANDS.find(
          b => b.businessNameKey === name.toLowerCase()
        );

        if (!brand) {
          return {
            error: {
              status: 404,
              statusText: 'Not Found',
              data: 'Brand not found',
            },
          };
        }

        return { data: brand };
      },
    }),

    // Get top-rated brands (example: ratingText starts with 4.7+)
    getTopRatedBrands: builder.query<Brand[], void>({
      queryFn: () => {
        const top = MOCK_BRANDS.filter(b => {
          const match = b.ratingText.match(/^(\d\.\d)/);
          const rating = match ? parseFloat(match[1]) : 0;
          return rating >= 4.7;
        });
        return { data: top };
      },
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByNameQuery,
  useGetTopRatedBrandsQuery,
} = brandsApiService;