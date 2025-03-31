export const filterProductsByCategory = (products: any[], categoryIds: string[]) => {
  if (!products.length) return [];
  return products.filter((product) => product.category_id && categoryIds.includes(product.category_id));
};

export const getCategoryType = (
  selectedCategory: string | null,
  plantCategories: any[],
  accessoryCategories: any[],
  kitCategories: any[]
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
  products: any[],
  productsByType: any[],
  selectedCategory: string | null,
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null,
  type: 'plant' | 'accessory' | 'kit'
): any[] => {
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
