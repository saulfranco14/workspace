import { supabase } from '@/app/config/supabaseClient';
import { CartItem } from '@/app/interfaces/cart.interface';

/**
 * Inserts a new item into the cart
 * @param cartId - ID of the cart
 * @param productId - ID of the product
 * @param quantity - Quantity to add (default is 1)
 * @returns The created item or null if there is an error
 */
export const insertCartItem = async (
  cartId: string,
  productId: string,
  quantity: number = 1
): Promise<CartItem | null> => {
  try {
    console.log('Intentando insertar:', { cartId, productId, quantity });

    const response = await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: productId,
      quantity,
    });

    if (response.error) {
      console.error('Error al insertar item en el carrito:', response.error);
      throw response.error;
    }

    return response.data;
  } catch (error) {
    console.error('Error en insertCartItem:', error);
    return null;
  }
};

/**
 * Gets an item from the cart by its ID
 * @param itemId - ID of the cart item
 * @returns The item with product data or null if there is an error
 */
export const getCartItemById = async (itemId: string): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          stock
        )
      `
      )
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error al obtener item del carrito:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en getCartItemById:', error);
    return null;
  }
};

/**
 * Gets an item from the cart by cart ID and product ID
 * @param cartId - ID of the cart
 * @param productId - ID of the product
 * @returns The item with product data or null if there is an error
 */
export const getCartItem = async (cartId: string, productId: string): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          stock
        )
      `
      )
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching cart item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getCartItem:', error);
    return null;
  }
};

/**
 * Updates the quantity of a cart item
 * @param itemId - ID of the cart item
 * @param quantity - New quantity
 * @returns The updated item or null if there is an error
 */
export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId).select();

    if (error) {
      console.error('Error al actualizar cantidad del item:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0] || null;
  } catch (error) {
    console.error('Error en updateCartItemQuantity:', error);
    return null;
  }
};

/**
 * Checks if a product already exists in the cart
 * @param cartId - ID of the cart
 * @param productId - ID of the product
 * @returns The existing item or null if it doesn't exist
 */
export const getCartItemByProductId = async (cartId: string, productId: string): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) {
      console.error('Error al buscar item por producto:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en getCartItemByProductId:', error);
    return null;
  }
};

/**
 * Removes an item from the cart
 * @param itemId - ID of the item to remove
 * @returns true if it was removed correctly, false otherwise
 */
export const removeCartItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

    if (error) {
      console.error('Error al eliminar item del carrito:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en removeCartItem:', error);
    return false;
  }
};

/**
 * Gets all items from a cart
 * @param cartId - ID of the cart
 * @returns Array of items with product data or null if there is an error
 */
export const getCartItems = async (cartId: string): Promise<CartItem[] | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          stock
        )
      `
      )
      .eq('cart_id', cartId);

    if (error) {
      console.error('Error al obtener items del carrito:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en getCartItems:', error);
    return null;
  }
};

/**
 * Clears all items from a cart
 * @param cartId - ID of the cart
 * @returns true if they were cleared correctly, false otherwise
 */
export const clearCartItems = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);

    if (error) {
      console.error('Error al vaciar el carrito:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en clearCartItems:', error);
    return false;
  }
};
