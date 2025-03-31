import { supabase } from '@/app/config/supabaseClient';
import { getFingerprint } from './deviceService';
import { Cart, CartItem } from '@/app/interfaces/cart.interface';

export const getOrCreateCart = async (userId?: string) => {
  const fingerprint = getFingerprint();

  try {
    const { data: existingCart, error: searchError } = await supabase
      .from('carts')
      .select('*')
      .or(userId ? `user_id.eq.${userId}` : `device_fingerprint.eq.${fingerprint}`)
      .maybeSingle();

    if (searchError) throw searchError;

    if (existingCart) return existingCart;

    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert([
        {
          user_id: userId || null,
          device_fingerprint: !userId ? await getFingerprint() : null,
        },
      ])
      .select()
      .single();

    if (createError) throw createError;

    return newCart;
  } catch (error) {
    console.error('Error al obtener o crear carrito:', error);
    return null;
  }
};

export async function migrateCart(userId: string, fingerprint: string) {
  try {
    const { data: anonCart } = await supabase
      .from('carts')
      .select('*')
      .eq('device_fingerprint', fingerprint)
      .maybeSingle();

    if (!anonCart) return { success: true };

    const { data: userCart } = await supabase.from('carts').select('*').eq('user_id', userId).maybeSingle();

    let targetCartId: string;

    if (!userCart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) throw createError;
      targetCartId = newCart.id;
    } else {
      targetCartId = userCart.id;
    }

    const { data: anonItems } = await supabase.from('cart_items').select('*').eq('cart_id', anonCart.id);

    if (!anonItems?.length) {
      await supabase.from('carts').delete().eq('id', anonCart.id);
      return { success: true };
    }

    const itemsToInsert = anonItems.map((item) => ({
      cart_id: targetCartId,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const { error: insertError } = await supabase
      .from('cart_items')
      .upsert(itemsToInsert, { onConflict: 'cart_id,product_id' });

    if (insertError) throw insertError;

    await supabase.from('carts').delete().eq('id', anonCart.id);

    return { success: true };
  } catch (error) {
    console.error('Error al migrar carrito:', error);
    return { success: false, error };
  }
}

export const getCartWithItems = async (cartId: string): Promise<Cart | null> => {
  try {
    // Obtener el carrito
    const { data: cart, error: cartError } = await supabase.from('carts').select('*').eq('id', cartId).single();

    if (cartError) throw cartError;

    // Obtener los items del carrito con información del producto
    const { data: items, error: itemsError } = await supabase
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

    if (itemsError) throw itemsError;

    return {
      ...cart,
      items: items as CartItem[],
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
    // Verificar si el producto ya está en el carrito
    const { data: existingItem, error: searchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .maybeSingle();

    if (searchError) throw searchError;

    if (existingItem) {
      // Actualizar la cantidad
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
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
        .single();

      if (updateError) throw updateError;
      return updatedItem;
    } else {
      // Insertar nuevo item
      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_id: cartId,
            product_id: productId,
            quantity,
          },
        ])
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
        .single();

      if (insertError) throw insertError;
      return newItem;
    }
  } catch (error) {
    console.error('Error al añadir item al carrito:', error);
    return null;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem | null> => {
  try {
    const { data: updatedItem, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
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
      .single();

    if (error) throw error;
    return updatedItem;
  } catch (error) {
    console.error('Error al actualizar cantidad del item:', error);
    return null;
  }
};

export const removeCartItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al eliminar item del carrito:', error);
    return false;
  }
};

export const clearCart = async (cartId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    return false;
  }
};
