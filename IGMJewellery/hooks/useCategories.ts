import { Department, SubCategory } from '@/interfaces/category.interface';
import { useMemo, useState } from 'react';

// --- MOCK DATA ---
// Using specific Unsplash images to mimic the look of Gold Rings, Pendants, etc.

const SUB_CATS_RINGS: SubCategory[] = [
  { id: 'all', name: 'All', imageUrl: 'https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=200' },
  { id: 'engagement', name: 'Engagement', imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe635da0?q=80&w=200' },
  { id: 'wedding', name: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=200' },
  { id: 'casual', name: 'Casual', imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200' },
  { id: 'stone', name: 'Stone', imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=200' },
  { id: 'bands', name: 'Bands', imageUrl: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=200' },
  { id: 'signet', name: 'Signet', imageUrl: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=200' },
  { id: 'promise', name: 'Promise', imageUrl: 'https://images.unsplash.com/photo-1605100804763-eb2fc645a382?q=80&w=200' },
  { id: 'stackable', name: 'Stackable', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200' },
];

const SUB_CATS_NECKLACE: SubCategory[] = [
  { id: 'all', name: 'All', imageUrl: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=200' },
  { id: 'chains', name: 'Chains', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200' },
  { id: 'pendants', name: 'Pendants', imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba42d52e90e?q=80&w=200' },
  { id: 'chokers', name: 'Chokers', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200' },
];

const DEPARTMENTS: Department[] = [
  {
    id: 'mens',
    name: "Men's",
    imageUrl: require('../assets/images/men_department.png'), // Gold Rings look
    categories: [
      { id: 'm-rings', name: 'Rings', subCategories: SUB_CATS_RINGS },
      { id: 'm-chains', name: 'Chains', subCategories: SUB_CATS_NECKLACE },
    ]
  },
  {
    id: 'womens',
    name: "Women's",
    imageUrl: require('../assets/images/women_department.png'), // Green Pendant look
    categories: [
      { id: 'w-rings', name: 'Rings', subCategories: SUB_CATS_RINGS },
      { id: 'w-necklace', name: 'Necklace', subCategories: SUB_CATS_NECKLACE },
      { id: 'w-earring', name: 'Earring', subCategories: SUB_CATS_RINGS },
      { id: 'w-hair', name: 'Hair accesories', subCategories: [] },
      { id: 'w-necklace2', name: 'Necklace Sets', subCategories: SUB_CATS_NECKLACE },
      { id: 'w-earring2', name: 'Studs', subCategories: [] },
      { id: 'w-hair2', name: 'Clips', subCategories: [] },
    ]
  },
  {
    id: 'kids',
    name: "Kid's",
    imageUrl: require('../assets/images/kids_department.png'), // Cute/Small items
    categories: [
      { id: 'k-earring', name: 'Earrings', subCategories: [] },
      { id: 'k-bracelets', name: 'Bracelets', subCategories: [] },
    ]
  }
];

export const useCategories = () => {
  const [activeDepartmentId, setActiveDepartmentId] = useState<string>('womens');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('w-rings');

  // Derive current data based on selection
  const activeDepartment = useMemo(() => 
    DEPARTMENTS.find(d => d.id === activeDepartmentId) || DEPARTMENTS[0], 
  [activeDepartmentId]);

  const activeCategory = useMemo(() => 
    activeDepartment.categories.find(c => c.id === activeCategoryId) || activeDepartment.categories[0], 
  [activeDepartment, activeCategoryId]);

  const subCategories = activeCategory?.subCategories || [];

  return {
    departments: DEPARTMENTS,
    activeDepartment,
    setActiveDepartmentId,
    activeCategory,
    setActiveCategoryId,
    subCategories,
  };
};