import { Cart, CartItem } from '@/interfaces/cart.interface';
import {
  insertCartItem,
  getCartItemByProductId,
  updateCartItemQuantity as updateCartItemQty,
  getCartItemById,
  removeCartItem as removeItem,
  clearCartItems,
  getCartItems,
} from '@/services/cart/cartItemsService';
import { findCart, createCart, getCartById, deleteCart } from './cart/cartDatabaseService';
import { getFingerprint } from '@/services/deviceService';

export const getOrCreateCart = async (userId?: string) => {
  try {
    const fingerprint = await getFingerprint();

    if (!userId && !fingerprint) {
      console.error('No se pudo obtener userId o fingerprint');
      return null;
    }

    const existingCart = await findCart(userId, fingerprint || undefined);

    if (existingCart) {
      return existingCart;
    }

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
    const existingItem = await getCartItemByProductId(cartId, productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      return await updateCartItemQty(existingItem.id, newQuantity);
    } else {
      const newItem = await insertCartItem(cartId, productId, quantity);

      if (!newItem) {
        throw new Error('No se pudo insertar el item en el carrito');
      }

      return await getCartItemById(newItem.id);
    }
  } catch (error) {
    console.error('Error al añadir item al carrito:', error);
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
