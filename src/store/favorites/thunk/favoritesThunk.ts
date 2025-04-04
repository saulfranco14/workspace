import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserFavoriteCollections,
  createCollection,
  addProductToFavorites,
  removeProductFromFavorites,
  deleteCollection,
} from '@/services/favoritesService';

export const fetchUserFavoriteCollections = createAsyncThunk(
  'favorites/fetchUserFavoriteCollections',
  async (_, { rejectWithValue }) => {
    try {
      const collections = await getUserFavoriteCollections();
      return collections;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error al obtener las colecciones de favoritos');
    }
  }
);

export const createFavoriteCollection = createAsyncThunk(
  'favorites/createFavoriteCollection',
  async (name: string, { rejectWithValue }) => {
    try {
      const newCollection = await createCollection(name);
      return newCollection;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error al crear la colección de favoritos');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async ({ productId, collectionId }: { productId: string; collectionId: string }, { rejectWithValue }) => {
    try {
      const result = await addProductToFavorites(productId, collectionId);

      return {
        item: result.item,
        collectionId,
        isExisting: result.isExisting,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error al añadir el producto a favoritos');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async ({ itemId, collectionId }: { itemId: string; collectionId: string }, { rejectWithValue }) => {
    try {
      const result = await removeProductFromFavorites(itemId, collectionId);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error al eliminar el producto de favoritos');
    }
  }
);

export const removeFavoriteCollection = createAsyncThunk(
  'favorites/removeFavoriteCollection',
  async (collectionId: string, { rejectWithValue }) => {
    try {
      const result = await deleteCollection(collectionId);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error al eliminar la colección de favoritos');
    }
  }
);
