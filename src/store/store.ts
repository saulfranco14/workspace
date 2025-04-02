import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/auth/slices/authSlice';
import productsReducer from '@/store/products/slices/productsSlice';
import cartReducer from '@/store/cart/slices/cartSlice';
import favoritesReducer from '@/store/favorites/slices/favoritesSlice';

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
