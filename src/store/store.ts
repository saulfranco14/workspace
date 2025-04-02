import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/store/auth/slices/authSlice';
import productsReducer from '@/app/store/products/slices/productsSlice';
import cartReducer from '@/app/store/cart/slices/cartSlice';
import favoritesReducer from '@/app/store/favorites/slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
