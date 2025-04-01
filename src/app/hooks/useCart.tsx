'use client';

import { useDispatch, useSelector } from 'react-redux';
import { openCart, closeCart } from '@/app/store/cart/slices/cartSlice';
import { RootState } from '@/app/store/store';
import { addToCart, updateItemQuantity, removeFromCart, emptyCart } from '@/app/store/cart/thunk/cartThunk';

export const useCart = () => {
  const dispatch = useDispatch();

  const { cart, items, loading, error, isOpen } = useSelector((state: RootState) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  const addProductToCart = async (productId: string, quantity: number = 1) => {
    try {
      // @ts-ignore
      const resultAction = await dispatch(addToCart({ productId, quantity }));

      if (!cart?.id) {
        throw new Error('No hay un carrito activo');
      }

      if (resultAction.error) {
        // @ts-ignore - Error message está disponible pero TypeScript no lo reconoce
        throw new Error(resultAction.error.message || 'Error al añadir al carrito');
      }

      return resultAction.payload;
    } catch (error) {
      console.error('Error en addProductToCart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        // @ts-ignore
        await dispatch(removeFromCart(itemId));
      } else {
        // @ts-ignore
        await dispatch(updateItemQuantity({ itemId, quantity }));
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // @ts-ignore
      await dispatch(removeFromCart(itemId));
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const clearCart = async () => {
    try {
      // @ts-ignore
      await dispatch(emptyCart());
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
    }
  };

  const showCart = () => dispatch(openCart());
  const hideCart = () => dispatch(closeCart());

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
