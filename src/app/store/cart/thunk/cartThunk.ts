import { AddToCartPayload, CartState, UpdateCartItemPayload } from '@/app/interfaces/cart.interface';
import {
  getOrCreateCart,
  getCartWithItems,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '@/app/services/cart/cartService';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId: string | undefined) => {
  console.count('fetchCart called');

  const cart = await getOrCreateCart(userId);

  if (!cart) console.error('No se pudo obtener el carrito');
  if (!cart) return null;

  const cartWithItems = await getCartWithItems(cart.id);
  return cartWithItems;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: AddToCartPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };

      if (!state.cart.cart?.id) {
        return rejectWithValue('No hay un carrito activo');
      }

      if (!state.cart.cart) {
        return rejectWithValue('Carrito no disponible');
      }

      const result = await addItemToCart(state.cart.cart.id, productId, quantity);

      if (!result) {
        return rejectWithValue('No se pudo añadir el producto al carrito');
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || error.error_description || 'Error al añadir el producto al carrito';

      console.error('Error en addToCart thunk:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ itemId, quantity }: UpdateCartItemPayload) => {
    const result = await updateCartItemQuantity(itemId, quantity);

    if (!result) {
      throw new Error('No se pudo actualizar la cantidad');
    }

    return result;
  }
);

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId: string) => {
  const success = await removeCartItem(itemId);
  if (!success) throw new Error('No se pudo eliminar el producto del carrito');

  return itemId;
});

export const emptyCart = createAsyncThunk('cart/emptyCart', async (_, { getState }) => {
  const state = getState() as { cart: CartState };
  if (!state.cart.cart?.id) throw new Error('No hay un carrito activo');

  const success = await clearCart(state.cart.cart.id);
  if (!success) throw new Error('No se pudo vaciar el carrito');

  return true;
});
