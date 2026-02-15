import { configureStore } from "@reduxjs/toolkit";
import { brandsApiService } from "./apis/brandsApi";
import { cartApiService } from "./apis/cart";
import { categoryApiService } from "./apis/categories";
import { checkoutApiService } from "./apis/checkout";
import { giftApi } from "./apis/giftApi";
import { productApiService } from "./apis/product";
import { profileApiService } from "./apis/profile";
import { textSearchApi } from "./apis/textSearchApi";
import { wishlistApiService } from "./apis/wishlist";
import { magentoApiService } from "./newApis/magentoApi";
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
    [wishlistApiService.reducerPath]: wishlistApiService.reducer,
    [giftApi.reducerPath]: giftApi.reducer,
    [magentoApiService.reducerPath]: magentoApiService.reducer,
    [textSearchApi.reducerPath]: textSearchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApiService.middleware,
      productApiService.middleware,
      categoryApiService.middleware,
      brandsApiService.middleware,
      cartApiService.middleware,
      checkoutApiService.middleware,
      wishlistApiService.middleware,
      giftApi.middleware,
      magentoApiService.middleware,
      textSearchApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
