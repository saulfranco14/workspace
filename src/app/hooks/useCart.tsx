'use client';

import { useDispatch, useSelector } from 'react-redux';

import { useSession } from '@/app/hooks/useSession';
import { openCart, closeCart } from '@/app/store/cart/slices/cartSlice';
import { RootState } from '@/app/store/store';
import { addToCart, updateItemQuantity, removeFromCart, emptyCart } from '@/app/store/cart/thunk/cartThunk';
import { useSingleEffect } from './useSingleEffect';
import { useEffect } from 'react';

export const useCart = () => {
  const dispatch = useDispatch();
  const { session } = useSession();

  const { cart, items, loading, error, isOpen } = useSelector((state: RootState) => state.cart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const addProductToCart = (productId: string, quantity: number = 1) => {
    // @ts-ignore - Due to typed payloads
    dispatch(addToCart({ productId, quantity }));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // @ts-ignore
      dispatch(removeFromCart(itemId));
    } else {
      // @ts-ignore
      dispatch(updateItemQuantity({ itemId, quantity }));
    }
  };

  const removeItem = (itemId: string) => {
    // @ts-ignore
    dispatch(removeFromCart(itemId));
  };

  const clearCart = () => {
    // @ts-ignore
    dispatch(emptyCart());
  };

  const showCart = () => {
    dispatch(openCart());
  };

  const hideCart = () => {
    dispatch(closeCart());
  };

  return {
    cart,
    items,
    loading,
    error,
    isOpen,
    totalItems,
    totalPrice,
    addProductToCart,
    updateQuantity,
    removeItem,
    clearCart,
    showCart,
    hideCart,
  };
};
