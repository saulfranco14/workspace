import { FavoriteCollection, FavoriteItem } from '@/app/interfaces/favorites.interface';
import { getFingerprint } from '@/app/services/deviceService';
import { supabase } from '@/app/config/supabaseClient';

/**
 * Obtiene todas las colecciones de favoritos del usuario
 */
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
  } catch (error: any) {
    console.error('Error al obtener colecciones de favoritos:', error);
    throw error;
  }
};

/**
 * Obtiene una colección de favoritos por su ID
 * @param collectionId - ID de la colección
 * @returns La colección con sus items o null si hay un error
 */
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

/**
 * Crea una nueva colección de favoritos
 */
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
    console.log('fullCollection', fullCollection);

    return fullCollection as FavoriteCollection;
  } catch (error) {
    console.error('Error al crear colección de favoritos :O', error);
    throw error;
  }
};

/**
 * Agrega un producto a una colección de favoritos
 */
export const addProductToFavorites = async (productId: string, collectionId: string): Promise<FavoriteItem> => {
  try {
    const favoriteItem = {
      collection_id: collectionId,
      product_id: productId,
    };

    const { data, error } = await supabase
      .from('favorite_items')
      .insert(favoriteItem)
      .select('*, product:products(*)')
      .single();

    if (error) throw error;

    return data as FavoriteItem;
  } catch (error: any) {
    console.error('Error al añadir producto a favoritos:', error);
    throw error;
  }
};

/**
 * Remueve un producto de los favoritos
 */
export const removeProductFromFavorites = async (
  itemId: string,
  collectionId: string
): Promise<{ itemId: string; collectionId: string }> => {
  try {
    const { error } = await supabase.from('favorite_items').delete().eq('id', itemId).eq('collection_id', collectionId);

    if (error) throw error;

    return { itemId, collectionId };
  } catch (error: any) {
    console.error('Error al eliminar producto de favoritos:', error);
    throw error;
  }
};

/**
 * Elimina una colección de favoritos
 */
export const deleteCollection = async (collectionId: string): Promise<string> => {
  try {
    const { error } = await supabase.from('favorite_collections').delete().eq('id', collectionId);

    if (error) throw error;

    return collectionId;
  } catch (error: any) {
    console.error('Error al eliminar colección de favoritos:', error);
    throw error;
  }
};
