import { getFingerprint } from '../deviceService';
import { Cart, CartItem } from '@/app/interfaces/cart.interface';
import {
  insertCartItem,
  getCartItemByProductId,
  updateCartItemQuantity as updateCartItemQty,
  removeCartItem as removeItem,
  clearCartItems,
  getCartItems,
  getCartItem,
} from './cartItemsService';
import { findCart, createCart, getCartById, deleteCart, updateCart } from './cartDatabaseService';

export const getOrCreateCart = async (userId?: string) => {
  try {
    const fingerprint = await getFingerprint();

    if (!userId && !fingerprint) {
      console.error('No se pudo obtener userId o fingerprint');
      return null;
    }

    const existingCart = await findCart(userId, fingerprint || undefined);

    if (existingCart) return existingCart;

    return await createCart(userId, fingerprint || undefined);
  } catch (error) {
    console.error('Error al obtener o crear carrito:', error);
    return null;
  }
};

export async function migrateCart(userId: string, fingerprint: string) {
  try {
    const anonCart = await findCart(undefined, fingerprint);
    if (!anonCart) return { success: true };

    const userCart = await findCart(userId);

    let targetCartId: string;

    if (!userCart) {
      const newCart = await createCart(userId);
      if (!newCart) throw new Error('Error al crear carrito de usuario');
      targetCartId = newCart.id;
    } else {
      targetCartId = userCart.id;
    }

    const anonItems = await getCartItems(anonCart.id);

    if (!anonItems?.length) {
      await deleteCart(anonCart.id);
      return { success: true };
    }

    const itemsToInsert = anonItems.map((item) => ({
      cart_id: targetCartId,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    for (const item of itemsToInsert) {
      const existingItem = await getCartItemByProductId(targetCartId, item.product_id);

      if (existingItem) {
        await updateCartItemQty(existingItem.id, existingItem.quantity + item.quantity);
      } else {
        await insertCartItem(targetCartId, item.product_id, item.quantity);
      }
    }

    await deleteCart(anonCart.id);

    return { success: true };
  } catch (error) {
    console.error('Error al migrar carrito:', error);
    return { success: false, error };
  }
}

export interface CartWithItems {
  cart: Cart;
  items: CartItem[];
}

export const getCartWithItems = async (cartId: string): Promise<CartWithItems | null> => {
  try {
    const cart = await getCartById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const items = await getCartItems(cartId);
    if (!items) throw new Error('Error al obtener items del carrito');

    return {
      cart,
      items,
    };
  } catch (error) {
    console.error('Error al obtener carrito con items:', error);
    return null;
  }
};

export const addItemToCart = async (
  cartId: string,
  productId: string,
  quantity: number = 1
): Promise<CartItem | null> => {
  try {
    if (!cartId) throw new Error('Invalid cart ID');
    if (!productId) throw new Error('Invalid product ID');
    if (quantity <= 0) throw new Error('Quantity must be greater than 0');

    const cart = await getCartById(cartId);
    if (!cart) {
      throw new Error('Cart does not exist');
    }

    const existingItem = await getCartItemByProductId(cartId, productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const updatedItem = await updateCartItemQty(existingItem.id, newQuantity);

      if (!updatedItem) {
        throw new Error('Could not update product quantity');
      }

      return updatedItem;
    } else {
      await insertCartItem(cartId, productId, quantity);

      const newItem = await getCartItem(cartId, productId);

      if (!newItem) {
        throw new Error('Could not insert product into cart');
      }

      return newItem;
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem | null> => {
  try {
    return await updateCartItemQty(itemId, quantity);
  } catch (error) {
    console.error('Error al actualizar cantidad del item:', error);
    return null;
  }
};

export const removeCartItem = async (itemId: string): Promise<boolean> => {
  try {
    return await removeItem(itemId);
  } catch (error) {
    console.error('Error al eliminar item del carrito:', error);
    return false;
  }
};

export const clearCart = async (cartId: string): Promise<boolean> => {
  try {
    return await clearCartItems(cartId);
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    return false;
  }
};
