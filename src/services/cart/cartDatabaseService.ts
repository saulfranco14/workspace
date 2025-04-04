import { supabase } from '@/config/supabaseClient';
import { Cart } from '@/interfaces/cart.interface';

/**
 * Finds a cart by user ID or fingerprint
 * @param userId - User ID (optional)
 * @param fingerprint - Device fingerprint (optional)
 * @returns The found cart or null if it does not exist
 */
export const findCart = async (userId?: string, fingerprint?: string): Promise<Cart | null> => {
  try {
    if (!userId && !fingerprint) {
      throw new Error('userId or fingerprint is required to find a cart');
    }

    let query = supabase.from('carts').select('*').limit(1).order('created_at', { ascending: false });

    if (userId && fingerprint) {
      const orConditions = [];
      if (userId) orConditions.push(`user_id.eq.${userId}`);
      if (fingerprint) orConditions.push(`device_fingerprint.eq.${fingerprint}`);
      query = query.or(orConditions.join(','));
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (fingerprint) {
      query = query.eq('device_fingerprint', fingerprint);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error finding cart:', error);
      throw error;
    }

    return data && data.length > 0 ? { ...data[0] } : null;
  } catch (error) {
    console.error('Error in findCart:', error);
    return null;
  }
};

/**
 * Creates a new cart
 * @param userId - User ID (optional)
 * @param fingerprint - Device fingerprint (optional)
 * @returns The created cart or null if there is an error
 */
export const createCart = async (userId?: string, fingerprint?: string): Promise<Cart | null> => {
  try {
    if (!userId && !fingerprint) {
      throw new Error('Se requiere userId o fingerprint para crear un carrito');
    }

    const newCart = {
      user_id: userId || null,
      device_fingerprint: fingerprint,
    };

    const { error } = await supabase.from('carts').insert(newCart);

    if (error) {
      console.error('Error al crear carrito:', error);
      throw error;
    }

    const foundCart = await findCart(userId, fingerprint);

    if (!foundCart) {
      console.error('No se pudo encontrar el carrito recién creado');
      throw new Error('No se pudo encontrar el carrito recién creado');
    }

    return foundCart;
  } catch (error) {
    console.error('Error en createCart:', error);
    return null;
  }
};

/**
 * Retrieves a cart by its ID
 * @param cartId - ID of the cart
 * @returns The found cart or null if it does not exist
 */
export const getCartById = async (cartId: string): Promise<Cart | null> => {
  try {
    const { data, error } = await supabase.from('carts').select('*').eq('id', cartId).maybeSingle();

    if (error) {
      console.error('Error al obtener carrito por ID:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error en getCartById:', error);
    return null;
  }
};

/**
 * Deletes a cart by its ID
 * @param cartId - ID of the cart to delete
 * @returns true if it was deleted correctly, false otherwise
 */
export const deleteCart = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('carts').delete().eq('id', cartId);

    if (error) {
      console.error('Error al eliminar carrito:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteCart:', error);
    return false;
  }
};

export const updateCart = async (
  cartId: string,
  updates: Partial<Omit<Cart, 'id' | 'created_at' | 'updated_at'>>
): Promise<Cart | null> => {
  try {
    const { data, error } = await supabase.from('carts').update(updates).eq('id', cartId).select().single();

    if (error) {
      console.error('Error al actualizar carrito:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en updateCart:', error);
    return null;
  }
};
