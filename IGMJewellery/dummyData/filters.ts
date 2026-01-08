export const FILTER_CATEGORIES = [
  {
    id: 'productType',
    label: 'Product Type',
    type: 'grid' as const,
    options: [
      { id: 'ring', label: 'Ring' },
      { id: 'necklace', label: 'Necklace' },
      { id: 'bracelet', label: 'Bracelet' },
      { id: 'earring', label: 'Earring' },
      { id: 'pendant', label: 'Pendant' },
      { id: 'chain', label: 'Chain' },
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
      { id: 'gold', label: 'Gold' },
      { id: 'silver', label: 'Silver' },
      { id: 'platinum', label: 'Platinum' },
      { id: 'rose-gold', label: 'Rose Gold' },
    ]
  },
  {
    id: 'gemstone',
    label: 'Gemstone',
    type: 'grid' as const,
    options: [
      { id: 'diamond', label: 'Diamond' },
      { id: 'ruby', label: 'Ruby' },
      { id: 'emerald', label: 'Emerald' },
      { id: 'sapphire', label: 'Sapphire' },
      { id: 'pearl', label: 'Pearl' },
      { id: 'none', label: 'None' },
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
      { id: 'daily-wear', label: 'Daily Wear' },
      { id: 'wedding', label: 'Wedding' },
      { id: 'party', label: 'Party' },
      { id: 'festive', label: 'Festive' },
      { id: 'gift', label: 'Gift' },
    ]
  },
  {
    id: 'collection',
    label: 'Collection',
    type: 'list' as const,
    options: [
      { id: 'new-arrival', label: 'New Arrivals' },
      { id: 'bestseller', label: 'Bestsellers' },
      { id: 'exclusive', label: 'Exclusive' },
      { id: 'sale', label: 'Sale' },
    ]
  }
];