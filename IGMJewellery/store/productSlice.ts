import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '../enums/productType.enum';
import { Product } from '@/interfaces/product.interface';



type ProductsState = Product[];

const initialState: ProductsState = [];

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      return action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state[idx] = action.payload;
      }
    },
    removeProduct(state, action: PayloadAction<string>) {
      return state.filter(p => p.id !== action.payload);
    },
    clearProducts() {
      return [];
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  clearProducts,
} = productSlice.actions;

export const selectProducts = (state: { products: ProductsState }) => state.products;

export default productSlice.reducer;