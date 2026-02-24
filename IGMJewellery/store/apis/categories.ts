import {
  Department,
  SidebarCategory,
  SubCategory,
} from "@/interfaces/category.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MOCK_DEPARTMENTS } from "../data/categoriesData";

interface CategoryNavigationParams {
  departmentId?: string;
  categoryId?: string;
  subCategoryId?: string;
}

export const categoryApiService = createApi({
  reducerPath: "categories",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
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
        const department = MOCK_DEPARTMENTS.find((d) => d.id === id);

        if (!department) {
          return {
            error: {
              status: 404,
              statusText: "Not Found",
              data: "Department not found",
            },
          };
        }

        return { data: department };
      },
    }),

    // Get categories by department
    getCategoriesByDepartment: builder.query<SidebarCategory[], string>({
      queryFn: (departmentId) => {
        const department = MOCK_DEPARTMENTS.find((d) => d.id === departmentId);

        if (!department) {
          return { data: [] };
        }

        return { data: department.categories };
      },
    }),

    // Get subcategories by category ID
    getSubCategories: builder.query<
      SubCategory[],
      { departmentId: string; categoryId: string }
    >({
      queryFn: ({ departmentId, categoryId }) => {
        const department = MOCK_DEPARTMENTS.find((d) => d.id === departmentId);

        if (!department) {
          return { data: [] };
        }

        const category = department.categories.find((c) => c.id === categoryId);

        if (!category) {
          return { data: [] };
        }

        return { data: category.subCategories || [] };
      },
    }),

    // Get category hierarchy (useful for breadcrumbs)
    getCategoryHierarchy: builder.query<
      {
        department?: Department;
        category?: SidebarCategory;
        subCategory?: SubCategory;
      },
      CategoryNavigationParams
    >({
      queryFn: ({ departmentId, categoryId, subCategoryId }) => {
        let department: Department | undefined;
        let category: SidebarCategory | undefined;
        let subCategory: SubCategory | undefined;

        if (departmentId) {
          department = MOCK_DEPARTMENTS.find((d) => d.id === departmentId);
        }

        if (department && categoryId) {
          category = department.categories.find((c) => c.id === categoryId);
        }

        if (category && subCategoryId) {
          subCategory = category.subCategories?.find(
            (sc) => sc.id === subCategoryId
          );
        }

        return {
          data: {
            department,
            category,
            subCategory,
          },
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
