import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BrandAboutSection {
  title: string;
  paragraphs: string[];
}

export interface BrandStat {
  label: string;
  value: string;
  imageUri?: string;
}

export interface Brand {
  bwThumbnailUri?: string;  
  profileImageUri: string;
  businessNameKey: string; // optional key for internal use
  businessName: string; // used as unique key
  tagline: string;
  ratingText: string;
  storeButtonLabel: string;
  aboutSections: BrandAboutSection[];
  stats: BrandStat[];
  collections: BrandCollection[]
}

export interface BrandCollection {
  title: string;
  description?: string;
  imageUri: string;
  productIds: string[];
}

// Mock brands data
const MOCK_BRANDS: Brand[] = [
  {
    profileImageUri: 'https://drive.google.com/uc?export=download&id=113Cwm5g8GE6YO3rLKFAx_92uRd8uWc7C',
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
    collections:[{
      title: 'Gifting Collection',
      description: 'Thoughtful jewellery pieces perfect for meaningful gifts.',
      imageUri: 'https://example.com/images/brands/gifting_collection.jpg',
      productIds: ['prod19', 'prod20', 'prod21'],
    },
    {
      title: 'Heritage Gold',
      description: 'Inspired by Indian heritage and timeless gold artistry.',
      imageUri: 'https://example.com/images/brands/heritage_gold.jpg',
      productIds: ['prod22', 'prod23', 'prod24'],
    }
  ]
  },
  {
    profileImageUri: 'https://drive.google.com/uc?export=download&id=1BndyDIunNUIrWRbsrm1Sp-83t5o2jd_n',
    businessNameKey: 'malabar',
    businessName: 'Malabar Gold & Diamonds',
    tagline: 'Purity. Transparency. Trust.',
    ratingText: '4.6 · 10k+ reviews',
    storeButtonLabel: 'Visit Store',
    aboutSections: [
      {
        title: 'Global Legacy',
        paragraphs: [
          'Malabar Gold & Diamonds is one of the world’s largest jewelry retailers.',
          'Known for quality craftsmanship and transparent pricing across markets.',
        ],
      },
      {
        title: 'Ethical Excellence',
        paragraphs: [
          'We follow responsible sourcing and fair trade practices.',
          'Customer trust and purity assurance are at the heart of our brand.',
        ],
      },
    ],
    stats: [
      { label: 'Stores', value: '300+' },
      { label: 'Established', value: '1993' },
      { label: 'Countries', value: '10+' },
    ],
    collections:[{
      title: 'Heritage Collection',
      description: 'Timeless pieces inspired by Indian culture.',
      imageUri: 'https://example.com/images/brands/malabar_heritage.jpg',
      productIds: ['prod1', 'prod2', 'prod3'],
    },
    {
      title: 'Wedding Collection',
      description: 'Grand designs crafted for your once-in-a-lifetime moments.',
      imageUri: 'https://example.com/images/brands/wedding_collection.jpg',
      productIds: ['prod4', 'prod5', 'prod6'],
    }]
  }
,{
  profileImageUri: 'https://drive.google.com/uc?export=download&id=1uyqHO1IyKNvBMI2wNDLrCdOfB8uPKGap',
  businessNameKey: 'pcj',
  businessName: 'PC Jeweller',
  tagline: 'Celebrating trust and timeless beauty',
  ratingText: '4.5 · 8k+ reviews',
  storeButtonLabel: 'Visit Store',
  aboutSections: [
    {
      title: 'Trusted Craftsmanship',
      paragraphs: [
        'PC Jeweller is renowned for its traditional designs and purity assurance.',
        'A strong presence across India with a loyal customer base.',
      ],
    },
    {
      title: 'Quality Promise',
      paragraphs: [
        'Every ornament undergoes strict quality checks.',
        'We focus on value, trust, and long-term customer relationships.',
      ],
    },
  ],
  stats: [
    { label: 'Stores', value: '90+' },
    { label: 'Established', value: '2005' },
    { label: 'Countries', value: '1+' },
  ],
  collections:[{
    title: 'Bridal Classics',
    description: 'Traditional bridal designs with a timeless appeal.',
    imageUri: 'https://example.com/images/brands/bridal_classics.jpg',
    productIds: ['prod13', 'prod14', 'prod15'],
  },
  {
    title: 'Modern Minimal',
    description: 'Sleek contemporary pieces for a refined modern look.',
    imageUri: 'https://example.com/images/brands/modern_minimal.jpg',
    productIds: ['prod16', 'prod17', 'prod18'],
  },]
},
  {
    businessNameKey: 'tanishq',
    profileImageUri: 'https://drive.google.com/uc?export=download&id=1WoeWEPUu68OhUhuGb7IHa10ov856wW78',
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
    collections:[{
      title: 'Statement Pieces',
      description: 'Bold designs that turn heads and start conversations.',
      imageUri: '1WoeWEPUu68OhUhuGb7IHa10ov856wW78',
      productIds: ['prod25', 'prod26', 'prod27'],
    }]
  },
  {
    businessNameKey: 'caratlane',
    profileImageUri: 'https://drive.google.com/uc?export=download&id=1I0py7pF-1sl2LlSrsXrseMN91zTcjmFP',
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
    collections:[{
      title: 'Royal Heirlooms',
      description: 'Opulent designs inspired by royal Indian jewellery.',
      imageUri: 'https://example.com/images/brands/royal_heirlooms.jpg',
      productIds: ['prod28', 'prod29', 'prod30'],
    },
    {
      title: 'Evening Glam',
      description: 'Elegant statement pieces made for nights that shine.',
      imageUri: 'https://example.com/images/brands/evening_glam.jpg',
      productIds: ['prod34', 'prod35', 'prod36'],
    }]
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