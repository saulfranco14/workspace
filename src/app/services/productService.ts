import { supabase } from '@/app/config/supabaseClient';
import { CategoriesResponse, Category, Product, ProductsResponse } from '@/app/interfaces/product.interface';
import { formatProduct, handleError } from '../helpers/productHelpers';
import { formatCategory } from '../helpers/productHelpers';

export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const { data, error } = await supabase.from('categories').select('*, type:name').order('name');

    if (error) throw error;

    const categories =
      data?.map((item) =>
        formatCategory({
          ...item,
          type: item.type as 'plant' | 'accessory' | 'kit',
          description: item.description || undefined,
        })
      ) || null;
    return { data: categories, error: null };
  } catch (error) {
    return handleError<Category[]>(error, 'obtener categorías');
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
    let query = supabase.from('categories').select('*, type:name');

    if (typePatterns.length > 0) {
      const orConditions = typePatterns.map((pattern) => `name.ilike.%${pattern}%`).join(',');
      query = query.or(orConditions);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;

    const categories =
      data?.map((item) =>
        formatCategory({
          ...item,
          type: item.type as 'plant' | 'accessory' | 'kit',
          description: item.description || undefined,
        })
      ) || null;
    return { data: categories, error: null };
  } catch (error) {
    return handleError<Category[]>(error, 'obtener categorías por tipo');
  }
};

const queryProducts = async (
  queryFn: (query: ReturnType<typeof supabase.from>) => Promise<{
    data: Record<string, any>[] | null;
    error: Error | null;
  }>,
  operation: string
): Promise<ProductsResponse> => {
  try {
    const baseQuery = supabase.from('products').select(`
      *,
      category:categories(id, name, description)
    `);

    const { data, error } = await queryFn(baseQuery);

    if (error) throw error;

    const products = data?.map(formatProduct) || null;
    return { data: products, error: null };
  } catch (error) {
    return handleError<Product[]>(error, operation);
  }
};

export const getProducts = async (): Promise<ProductsResponse> => {
  return queryProducts((query) => query.order('name'), 'obtener productos');
};

export const getFeaturedProducts = async (): Promise<ProductsResponse> => {
  return queryProducts((query) => query.eq('is_featured', true).limit(6), 'obtener productos destacados');
};

export const getProductsByCategory = async (categoryId: string): Promise<ProductsResponse> => {
  return queryProducts(
    (query) => query.eq('category_id', categoryId).order('name'),
    `obtener productos de la categoría ${categoryId}`
  );
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
  return queryProducts(
    (query) => query.ilike('name', `%${searchTerm}%`).order('name'),
    `buscar productos con término "${searchTerm}"`
  );
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
  return queryProducts(
    (query) => query.in('category_id', categoryIds).order('name'),
    'obtener productos de múltiples categorías'
  );
};

export const getProductById = async (id: string): Promise<{ data: Product | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name, description)
      `
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return {
      data: data
        ? formatProduct({
            ...data,
            description: data.description || '',
            category_id: data.category_id || '',
            image_url: data.image_url || undefined,
            category: data.category
              ? {
                  ...data.category,
                  type: 'plant' as 'plant' | 'accessory' | 'kit',
                  description: data.category.description || undefined,
                }
              : undefined,
          })
        : null,
      error: null,
    };
  } catch (error) {
    return handleError<Product>(error, `obtener el producto con ID ${id}`);
  }
};
