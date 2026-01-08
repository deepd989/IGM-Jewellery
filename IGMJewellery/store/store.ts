import { configureStore } from '@reduxjs/toolkit';
import { productApiService } from './apis/product';
import { profileApiService } from './apis/profile';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    products: productApiService.reducer,
    user: userReducer,
    profile: profileApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApiService.middleware, productApiService.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;