import { ProductsState } from '@/app/interfaces/product.interface';

export const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
  productsByCategory: {},
  featuredProducts: [],
  categories: [],
  plantCategories: [],
  accessoryCategories: [],
  kitCategories: [],
  selectedCategory: null,
  selectedCategoryType: null,
  selectedCategoryName: null,
  selectedProduct: null,
  searchTerm: '',
  loading: false,
  error: null,
};
