import { assetUrl } from "@/constants/assets";
import { Department, SubCategory } from '@/interfaces/category.interface';
import { useMemo, useState } from 'react';

// --- MOCK DATA ---
// Using specific Unsplash images to mimic the look of Gold Rings, Pendants, etc.

const SUB_CATS_RINGS: SubCategory[] = [
  { id: 'all', name: 'All', imageUrl: assetUrl("mock.subcategory.ring.all") },
  { id: 'engagement', name: 'Engagement', imageUrl: assetUrl("mock.subcategory.ring.engagement") },
  { id: 'wedding', name: 'Wedding', imageUrl: assetUrl("mock.subcategory.ring.wedding") },
  { id: 'casual', name: 'Casual', imageUrl: assetUrl("mock.subcategory.ring.casual") },
  { id: 'stone', name: 'Stone', imageUrl: assetUrl("mock.subcategory.ring.stone") },
  { id: 'bands', name: 'Bands', imageUrl: assetUrl("mock.subcategory.ring.bands") },
  { id: 'signet', name: 'Signet', imageUrl: assetUrl("mock.subcategory.ring.signet") },
  { id: 'promise', name: 'Promise', imageUrl: assetUrl("mock.subcategory.ring.promise") },
  { id: 'stackable', name: 'Stackable', imageUrl: assetUrl("mock.subcategory.ring.stackable") },
];

const SUB_CATS_NECKLACE: SubCategory[] = [
  { id: 'all', name: 'All', imageUrl: assetUrl("mock.subcategory.necklace.all") },
  { id: 'chains', name: 'Chains', imageUrl: assetUrl("mock.subcategory.necklace.chains") },
  { id: 'pendants', name: 'Pendants', imageUrl: assetUrl("mock.subcategory.necklace.pendants") },
  { id: 'chokers', name: 'Chokers', imageUrl: assetUrl("mock.subcategory.necklace.chokers") },
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