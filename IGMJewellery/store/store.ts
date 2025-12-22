import { configureStore } from '@reduxjs/toolkit';
import { profileApiService } from './apis/profile';
import productsReducer from './productSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    profile: profileApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApiService.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;