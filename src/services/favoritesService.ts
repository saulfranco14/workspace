import { FavoriteCollection, FavoriteItem } from '@/interfaces/favorites.interface';
import { supabase } from '@/config/supabaseClient';
import { getFingerprint } from '@/services/deviceService';

export const getUserFavoriteCollections = async (): Promise<FavoriteCollection[]> => {
  try {
    const fingerprint = await getFingerprint();
    const { data: user } = await supabase.auth.getUser();

    if (!fingerprint && !user.user) {
      console.warn('No se pudo obtener fingerprint ni usuario autenticado');
      return [];
    }

    const query = supabase.from('favorite_collections').select('*, items:favorite_items(*, product:products(*))');

    if (user.user) {
      query.eq('user_id', user.user.id);
    } else if (fingerprint) {
      query.eq('device_fingerprint', fingerprint);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data as FavoriteCollection[];
  } catch (error) {
    console.error('Error al obtener colecciones de favoritos:', error);
    throw error;
  }
};

export const getCollection = async (): Promise<FavoriteCollection | null> => {
  try {
    const { data, error } = await supabase
      .from('favorite_collections')
      .select(
        `
        *,
        items:favorite_items(
          *,
          product:products(*)
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error al obtener colección de favoritos:', error);
      throw error;
    }

    console.log('getCollection', data);

    return data as FavoriteCollection;
  } catch (error) {
    console.error('Error en getCollection:', error);
    return null;
  }
};

export const createCollection = async (name: string): Promise<FavoriteCollection> => {
  try {
    const fingerprint = await getFingerprint();
    const { data: userData } = await supabase.auth.getUser();

    const newCollection = {
      name,
      user_id: userData.user?.id || null,
      device_fingerprint: fingerprint,
    };

    const { error } = await supabase.from('favorite_collections').insert(newCollection);
    if (error) throw error;

    const fullCollection = await getCollection();

    return fullCollection as FavoriteCollection;
  } catch (error) {
    console.error('Error al crear colección de favoritos :O', error);
    throw error;
  }
};

export const addProductToFavorites = async (
  productId: string,
  collectionId: string
): Promise<{ item: FavoriteItem | null; isExisting: boolean }> => {
  try {
    const { data: existingItem, error: checkError } = await supabase
      .from('favorite_items')
      .select('*, product:products(*)')
      .eq('product_id', productId)
      .eq('collection_id', collectionId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingItem) {
      return { item: existingItem as FavoriteItem, isExisting: true };
    }
    const favoriteItem = {
      collection_id: collectionId,
      product_id: productId,
    };

    const { error } = await supabase.from('favorite_items').insert(favoriteItem);

    if (error) throw error;

    const fullFavoriteItem = await getFavoriteByProductId(productId, collectionId);
    if (!fullFavoriteItem) throw new Error('Error al obtener el item de favoritos');

    const { data: itemWithProduct, error: productError } = await supabase
      .from('favorite_items')
      .select('*, product:products(*)')
      .eq('id', fullFavoriteItem.id)
      .single();

    if (productError) throw productError;

    return { item: itemWithProduct as FavoriteItem, isExisting: false };
  } catch (error) {
    console.error('Error al añadir producto a favoritos:', error);
    throw error;
  }
};

export const removeProductFromFavorites = async (
  itemId: string,
  collectionId: string
): Promise<{ itemId: string; collectionId: string }> => {
  try {
    const { error } = await supabase.from('favorite_items').delete().eq('id', itemId).eq('collection_id', collectionId);

    if (error) throw error;

    return { itemId, collectionId };
  } catch (error) {
    console.error('Error al eliminar producto de favoritos:', error);
    throw error;
  }
};

export const deleteCollection = async (collectionId: string): Promise<string> => {
  try {
    const { error } = await supabase.from('favorite_collections').delete().eq('id', collectionId);

    if (error) throw error;

    return collectionId;
  } catch (error) {
    console.error('Error al eliminar colección de favoritos:', error);
    throw error;
  }
};

export const getFavoriteByProductId = async (productId: string, collectionId: string): Promise<FavoriteItem | null> => {
  try {
    const { data, error } = await supabase
      .from('favorite_items')
      .select('*, product:products(*)')
      .eq('product_id', productId)
      .eq('collection_id', collectionId)
      .maybeSingle();

    if (error) {
      console.error('Error al obtener item de favoritos:', error);
      throw error;
    }

    return data as FavoriteItem;
  } catch (error) {
    console.error('Error en getFavoriteByProductId:', error);
    return null;
  }
};
