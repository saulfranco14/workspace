'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSession } from '@/app/hooks/useSession';
import { openCart, closeCart } from '@/app/store/cart/slices/cartSlice';
import { RootState } from '@/app/store/store';
import { fetchCart } from '@/app/store/cart/thunk/cartThunk';

export const useCart = () => {
  const dispatch = useDispatch();
  const { session } = useSession();

  const { cart, items, loading, error, isOpen } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const userId = session?.user?.id;
    // @ts-ignore - Because fetchCart expects a specifically typed argument
    dispatch(fetchCart(userId));
  }, [dispatch, session]);

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
