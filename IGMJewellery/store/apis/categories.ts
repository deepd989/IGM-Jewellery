import { Department, SidebarCategory, SubCategory } from '@/interfaces/category.interface';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const menDepartmentImage = require('../../assets/images/men_department.png');
const womenDepartmentImage = require('../../assets/images/women_department.png');
const kidsDepartmentImage = require('../../assets/images/kids_department.png');

// Mock subcategories data
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

const SUB_CATS_EARRING: SubCategory[] = [
  { id: 'all', name: 'All', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200' },
  { id: 'studs', name: 'Studs', imageUrl: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=200' },
  { id: 'hoops', name: 'Hoops', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200' },
  { id: 'drop', name: 'Drop', imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba42d52e90e?q=80&w=200' },
];

const SUB_CATS_BRACELET: SubCategory[] = [
  { id: 'all', name: 'All', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200' },
  { id: 'bangles', name: 'Bangles', imageUrl: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=200' },
  { id: 'chain', name: 'Chain', imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba42d52e90e?q=80&w=200' },
  { id: 'charm', name: 'Charm', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200' },
];

// Mock departments data
const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'mens',
    name: "Men's",
    imageUrl: menDepartmentImage,
    categories: [
      { id: 'm-rings', name: 'Rings', subCategories: SUB_CATS_RINGS },
      { id: 'm-chains', name: 'Chains', subCategories: SUB_CATS_NECKLACE },
      { id: 'm-bracelet', name: 'Bracelets', subCategories: SUB_CATS_BRACELET },
      { id: 'm-pendant', name: 'Pendants', subCategories: SUB_CATS_NECKLACE },
    ]
  },
  {
    id: 'womens',
    name: "Women's",
    imageUrl: womenDepartmentImage,
    categories: [
      { id: 'w-rings', name: 'Rings', subCategories: SUB_CATS_RINGS },
      { id: 'w-necklace', name: 'Necklace', subCategories: SUB_CATS_NECKLACE },
      { id: 'w-earring', name: 'Earring', subCategories: SUB_CATS_EARRING },
      { id: 'w-bracelet', name: 'Bracelets', subCategories: SUB_CATS_BRACELET },
      { id: 'w-pendant', name: 'Pendants', subCategories: SUB_CATS_NECKLACE },
      { id: 'w-necklace-sets', name: 'Necklace Sets', subCategories: SUB_CATS_NECKLACE },
      { id: 'w-anklet', name: 'Anklets', subCategories: SUB_CATS_BRACELET },
    ]
  },
  {
    id: 'kids',
    name: "Kid's",
    imageUrl: kidsDepartmentImage,
    categories: [
      { id: 'k-earring', name: 'Earrings', subCategories: SUB_CATS_EARRING },
      { id: 'k-bracelets', name: 'Bracelets', subCategories: SUB_CATS_BRACELET },
      { id: 'k-pendant', name: 'Pendants', subCategories: SUB_CATS_NECKLACE },
      { id: 'k-rings', name: 'Rings', subCategories: SUB_CATS_RINGS },
    ]
  }
];

interface CategoryNavigationParams {
  departmentId?: string;
  categoryId?: string;
  subCategoryId?: string;
}

export const categoryApiService = createApi({
  reducerPath: 'categories',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    // Get all departments
    getDepartments: builder.query<Department[], void>({
      queryFn: () => {
        return { data: MOCK_DEPARTMENTS };
      },
    }),

    // Get single department by ID
    getDepartmentById: builder.query<Department, string>({
      queryFn: (id) => {
        const department = MOCK_DEPARTMENTS.find(d => d.id === id);
        
        if (!department) {
          return { 
            error: { 
              status: 404, 
              statusText: 'Not Found',
              data: 'Department not found' 
            } 
          };
        }

        return { data: department };
      },
    }),

    // Get categories by department
    getCategoriesByDepartment: builder.query<SidebarCategory[], string>({
      queryFn: (departmentId) => {
        const department = MOCK_DEPARTMENTS.find(d => d.id === departmentId);
        
        if (!department) {
          return { data: [] };
        }

        return { data: department.categories };
      },
    }),

    // Get subcategories by category ID
    getSubCategories: builder.query<SubCategory[], { departmentId: string, categoryId: string }>({
      queryFn: ({ departmentId, categoryId }) => {
        const department = MOCK_DEPARTMENTS.find(d => d.id === departmentId);
        
        if (!department) {
          return { data: [] };
        }

        const category = department.categories.find(c => c.id === categoryId);
        
        if (!category) {
          return { data: [] };
        }

        return { data: category.subCategories || [] };
      },
    }),

    // Get category hierarchy (useful for breadcrumbs)
    getCategoryHierarchy: builder.query<{
      department?: Department;
      category?: SidebarCategory;
      subCategory?: SubCategory;
    }, CategoryNavigationParams>({
      queryFn: ({ departmentId, categoryId, subCategoryId }) => {
        let department: Department | undefined;
        let category: SidebarCategory | undefined;
        let subCategory: SubCategory | undefined;

        if (departmentId) {
          department = MOCK_DEPARTMENTS.find(d => d.id === departmentId);
        }

        if (department && categoryId) {
          category = department.categories.find(c => c.id === categoryId);
        }

        if (category && subCategoryId) {
          subCategory = category.subCategories?.find(sc => sc.id === subCategoryId);
        }

        return { 
          data: { 
            department, 
            category, 
            subCategory 
          } 
        };
      },
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useGetCategoriesByDepartmentQuery,
  useGetSubCategoriesQuery,
  useGetCategoryHierarchyQuery,
} = categoryApiService;