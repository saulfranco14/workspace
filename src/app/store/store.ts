import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/store/auth/slices/authSlice';
import productsReducer from '@/app/store/products/slices/productsSlice';
import cartReducer from '@/app/store/cart/slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
