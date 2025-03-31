import { supabase } from '@/app/config/supabaseClient';
import { CategoriesResponse, Product, ProductsResponse } from '@/app/interfaces/product.interface';

export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');

    return { data, error };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Fetches categories by type based on provided name patterns.
 * @async
 * @function getCategoriesByType
 * @param {string[]} typePatterns - Array of name patterns to filter categories.
 * @returns {Promise<CategoriesResponse>} A promise that resolves with the filtered categories or an error.
 * @example
 * const response = await getCategoriesByType(['plant', 'kit']);
 */
export const getCategoriesByType = async (typePatterns: string[]): Promise<CategoriesResponse> => {
  try {
    let query = supabase.from('categories').select('*');

    if (typePatterns.length > 0) {
      const orConditions = typePatterns.map((pattern) => `name.ilike.%${pattern}%`).join(',');
      query = query.or(orConditions);
    }

    const { data, error } = await query.order('name');
    return { data, error };
  } catch (error) {
    console.error('Error al obtener categorías por tipo:', error);
    return { data: null, error: error as Error };
  }
};

export const getProducts = async (): Promise<ProductsResponse> => {
  try {
    const { data, error } = await supabase.from('products').select('*, category:categories(name)').order('name');

    return { data: data as Product[], error };
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return { data: null, error: error as Error };
  }
};

export const getFeaturedProducts = async (): Promise<ProductsResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .eq('is_featured', true)
      .limit(6);

    return { data: data as Product[], error };
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    return { data: null, error: error as Error };
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<ProductsResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .eq('category_id', categoryId)
      .order('name');

    return { data: data as Product[], error };
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${categoryId}:`, error);
    return { data: null, error: error as Error };
  }
};

/**
 * Searches for products by a given term using full-text search.
 * @async
 * @function searchProducts
 * @param {string} searchTerm - The term to search for in product names.
 * @returns {Promise<ProductsResponse>} A promise that resolves with matching products or an error.
 * @example
 * const response = await searchProducts('succulent');
 */
export const searchProducts = async (searchTerm: string): Promise<ProductsResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .textSearch('name', searchTerm, { config: 'spanish' })
      .order('name');

    return { data: data as Product[], error };
  } catch (error) {
    console.error(`Error al buscar productos con término "${searchTerm}":`, error);
    return { data: null, error: error as Error };
  }
};

/**
 * Fetches products that belong to multiple categories.
 *
 * @async
 * @function getProductsByCategories
 * @param {string[]} categoryIds - Array of category IDs to filter products.
 * @returns {Promise<ProductsResponse>} A promise that resolves with the products or an error.
 * @example
 * const response = await getProductsByCategories(['123', '456']);
 */
export const getProductsByCategories = async (categoryIds: string[]): Promise<ProductsResponse> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .in('category_id', categoryIds)
      .order('name');

    return { data: data as Product[], error };
  } catch (error) {
    console.error(`Error al obtener productos de múltiples categorías:`, error);
    return { data: null, error: error as Error };
  }
};
