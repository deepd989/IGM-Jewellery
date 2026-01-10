import { configureStore } from "@reduxjs/toolkit";
import { brandsApiService } from "./apis/brandsApi";
import { cartApiService } from "./apis/cart";
import { categoryApiService } from "./apis/categories";
import { checkoutApiService } from "./apis/checkout";
import { productApiService } from "./apis/product";
import { profileApiService } from "./apis/profile";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    products: productApiService.reducer,
    user: userReducer,
    profile: profileApiService.reducer,
    [categoryApiService.reducerPath]: categoryApiService.reducer,
    brands: brandsApiService.reducer,
    [cartApiService.reducerPath]: cartApiService.reducer,
    [checkoutApiService.reducerPath]: checkoutApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApiService.middleware,
      productApiService.middleware,
      categoryApiService.middleware,
      brandsApiService.middleware,
      cartApiService.middleware,
      checkoutApiService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
