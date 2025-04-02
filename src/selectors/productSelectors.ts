import { RootState } from '@/app/store/store';

export const selectProductsState = (state: RootState) => state.products;

export const selectPlantCategories = (state: RootState) => state.products.plantCategories;

export const selectAccessoryCategories = (state: RootState) => state.products.accessoryCategories;

export const selectKitCategories = (state: RootState) => state.products.kitCategories;

export const selectProducts = (state: RootState) => state.products.products;

export const selectFeaturedProducts = (state: RootState) => state.products.featuredProducts;

export const selectSelectedCategory = (state: RootState) => state.products.selectedCategory;

export const selectSearchTerm = (state: RootState) => state.products.searchTerm;

export const selectProductsLoading = (state: RootState) => state.products.loading;

export const selectProductsError = (state: RootState) => state.products.error;

export const selectCategories = (state: RootState) => state.products.categories;

export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
