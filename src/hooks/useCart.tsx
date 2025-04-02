'use client';

import { useDispatch, useSelector } from 'react-redux';
import { openCart, closeCart } from '@/store/cart/slices/cartSlice';
import { RootState } from '@/store/store';
import { addToCart, updateItemQuantity, removeFromCart, emptyCart } from '@/store/cart/thunk/cartThunk';

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
      // @ts-expect-error: TypeScript no reconoce el tipo de retorno de dispatch
      const resultAction = await dispatch(addToCart({ productId, quantity }));

      if (!cart?.id) {
        throw new Error('No hay un carrito activo');
      }

      if (resultAction.error) {
        // @ts-expect-error: TypeScript no reconoce el tipo de error en resultAction
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
        // @ts-expect-error: TypeScript no reconoce el tipo de retorno de dispatch
        await dispatch(removeFromCart(itemId));
      } else {
        // @ts-expect-error: TypeScript no reconoce el tipo de retorno de dispatch
        await dispatch(updateItemQuantity({ itemId, quantity }));
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // @ts-expect-error: TypeScript no reconoce el tipo de retorno de dispatch
      await dispatch(removeFromCart(itemId));
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const clearCart = async () => {
    try {
      // @ts-expect-error: TypeScript no reconoce el tipo de retorno de dispatch
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
