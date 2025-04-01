import {
  getCategories,
  getCategoriesByType,
  getProducts,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
} from '@/app/services/productService';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await getCategories();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Error desconocido durante la búsqueda de categorías');
  }
});

export const fetchCategoriesByType = createAsyncThunk(
  'products/fetchCategoriesByType',
  async (_, { rejectWithValue }) => {
    try {
      const { data: plantCategoriesData, error: plantError } = await getCategoriesByType(['Plantas']);
      if (plantError) throw new Error(plantError.message);

      const { data: accessoryCategoriesData, error: accessoryError } = await getCategoriesByType([
        'Macetas',
        'Tierra',
        'Herramientas',
        'Decoración',
        'Riego',
      ]);
      if (accessoryError) throw new Error(accessoryError.message);

      const { data: kitCategoriesData, error: kitError } = await getCategoriesByType(['Kits']);
      if (kitError) throw new Error(kitError.message);

      return {
        plantCategories: plantCategoriesData || [],
        accessoryCategories: accessoryCategoriesData || [],
        kitCategories: kitCategoriesData || [],
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido durante la búsqueda de categorías por tipo');
    }
  }
);

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await getProducts();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Error desconocido durante la búsqueda de productos');
  }
});

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await getFeaturedProducts();
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido durante la búsqueda de productos destacados');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await getProductsByCategory(categoryId);
      if (error) throw new Error(error.message);
      return { categoryId, products: data };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido durante la búsqueda de productos por categoría');
    }
  }
);

export const searchProductsThunk = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const { data, error } = await searchProducts(searchTerm);
      if (error) {
        console.error('Error en la búsqueda:', error);
        throw new Error(error.message || 'Error en la búsqueda');
      }
      return data;
    } catch (error) {
      console.error('Error en searchProductsThunk:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido durante la búsqueda de productos');
    }
  }
);
