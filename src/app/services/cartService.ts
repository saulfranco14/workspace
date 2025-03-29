import { supabase } from '@/app/config/supabaseClient';
import { getFingerprint } from './deviceService';

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
          device_fingerprint: !userId ? fingerprint : null,
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
