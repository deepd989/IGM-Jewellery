export const FILTER_CATEGORIES = [
  {
    id: 'productType',
    label: 'Product Type',
    type: 'grid' as const,
    options: [
      { id: 'Ring', label: 'Ring' },
      { id: 'Necklace', label: 'Necklace' },
      { id: 'Bracelet', label: 'Bracelet' },
      { id: 'Earring', label: 'Earring' },
    ]
  },
  {
    id: 'brand',
    label: 'Brand',
    type: 'list' as const,
    options: [
      { id: 'Kalyan', label: 'Kalyan Jewellers' },
      { id: 'Malabar', label: 'Malabar Gold' },
      { id: 'Tanishq', label: 'Tanishq' },
    ]
  },
  {
    id: 'metal',
    label: 'Metal',
    type: 'list' as const,
    options: [
      { id: 'Gold', label: 'Gold' },
      { id: 'Silver', label: 'Silver' },
      { id: 'Platinum', label: 'Platinum' },
      { id: 'Rose Gold', label: 'Rose Gold' },
    ]
  },
  {
    id: 'gemstone',
    label: 'Gemstone',
    type: 'grid' as const,
    options: [
      { id: 'Natural Diamond', label: 'Diamond' },
      { id: 'Gemstone', label: 'Gemstone' },
    ]
  },
  {
    id: 'priceRange',
    label: 'Price Range',
    type: 'list' as const,
    options: [
      { id: 'under-10k', label: 'Under ₹10,000' },
      { id: '10k-25k', label: '₹10,000 - ₹25,000' },
      { id: '25k-50k', label: '₹25,000 - ₹50,000' },
      { id: '50k-100k', label: '₹50,000 - ₹1,00,000' },
      { id: 'above-100k', label: 'Above ₹1,00,000' },
    ]
  },
  {
    id: 'occasion',
    label: 'Occasion',
    type: 'list' as const,
    options: [
      { id: 'Daily Wear', label: 'Daily Wear' },
      { id: 'Wedding', label: 'Wedding' },
      { id: 'Anniversary', label: 'Anniversary' },
      { id: 'Birthday', label: 'Birthday' },
      { id: 'Party Wear', label: 'Party Wear' },
      { id: 'Diwali', label: 'Diwali' },
    ]
  },
];