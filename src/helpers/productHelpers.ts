import { Category, Product } from '@/interfaces/product.interface';
import { usePathname } from 'next/navigation';

export const filterProductsByCategory = (products: Product[], categoryIds: string[]) => {
  if (!products.length) return [];
  return products.filter((product) => product.category_id && categoryIds.includes(product.category_id));
};

export const getCategoryType = (
  selectedCategory: string | null,
  plantCategories: Category[],
  accessoryCategories: Category[],
  kitCategories: Category[]
): 'plant' | 'accessory' | 'kit' | null => {
  if (!selectedCategory) return null;

  const categoryTypeMap = [
    { categories: plantCategories, type: 'plant' as const },
    { categories: accessoryCategories, type: 'accessory' as const },
    { categories: kitCategories, type: 'kit' as const },
  ];

  const foundType = categoryTypeMap.find(({ categories }) => categories.some((cat) => cat.id === selectedCategory));

  return foundType ? foundType.type : null;
};

/**
 * Filters products by selected type and category
 * @param {Object[]} products - Complete list of products
 * @param {Object[]} productsByType - Products previously filtered by type
 * @param {string | null} selectedCategory - ID of the selected category
 * @param {string | null} selectedCategoryType - Type of the selected category
 * @param {'plant' | 'accessory' | 'kit'} type - Type of product to filter
 * @returns {Object[]} - Filtered products
 */
export const getFilteredProductsByType = (
  products: Product[],
  productsByType: Product[],
  selectedCategory: string | null,
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null,
  type: 'plant' | 'accessory' | 'kit'
): Product[] => {
  if (!selectedCategory) {
    return productsByType;
  }

  if (selectedCategoryType !== type) {
    return [];
  }

  return products.filter((product) => product.category_id === selectedCategory);
};

export const shouldShowSection = (
  selectedCategory: string | null,
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null,
  type: 'plant' | 'accessory' | 'kit'
): boolean => {
  return !selectedCategory || selectedCategoryType === type;
};

export const formatCategory = (category: Partial<Category>): Category => ({
  id: category.id || '',
  name: category.name || '',
  ...category,
  type: 'plant' as 'plant' | 'accessory' | 'kit',
});

export const formatProduct = (product: Partial<Product>): Product => ({
  id: product.id || '',
  name: product.name || '',
  price: product.price || 0,
  stock: product.stock || 0,
  category_id: product.category_id || '',
  ...product,
  description: product.description || '',
  category: product.category ? formatCategory(product.category as Partial<Category>) : undefined,
});

export const handleError = <T>(error: unknown, operation: string): { data: T | null; error: Error } => {
  console.error(`Error al ${operation}:`, error);
  return { data: null, error: error as Error };
};

export const removeLeadingSlash = (url?: string): string => {
  if (!url) return '';
  return url.startsWith('/') ? url.substring(1) : url;
};

export const isProductsPage = (url?: string): boolean => {
  if (!url) return false;
  const cleanUrl = removeLeadingSlash(url);
  return cleanUrl === 'productos' || cleanUrl.startsWith('productos/');
};

export const getDisplayProducts = <T>(products: T[], currentPath?: string, limit: number = 4): T[] => {
  if (isProductsPage(currentPath)) {
    return products;
  }
  return products.slice(0, limit);
};

export const useDisplayProducts = <T>(products: T[], limit: number = 4): T[] => {
  const pathname = usePathname();
  return getDisplayProducts(products, pathname, limit);
};
