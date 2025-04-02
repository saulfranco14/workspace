import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCategories,
  fetchCategoriesByType,
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductsByCategory,
  searchProductsThunk,
  fetchProductById,
} from '@/store/products/thunk/productThunk';
import { initialState } from '@/store/products/initialState';

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategory = action.payload;
      state.selectedCategoryType = null;
      state.selectedCategoryName = null;

      if (action.payload) {
        const category = state.categories.find((cat) => cat.id === action.payload);
        if (category) {
          state.selectedCategoryType = category.type;
          state.selectedCategoryName = category.name;
        }
      }

      if (action.payload === null) {
        if (state.searchTerm) {
          state.filteredProducts = state.filteredProducts.filter((product) => product.category_id === action.payload);
        } else {
          state.filteredProducts = state.products;
        }
      } else {
        if (state.searchTerm) {
          state.filteredProducts = state.filteredProducts.filter((product) => product.category_id === action.payload);
        } else {
          state.filteredProducts = state.products.filter((product) => product.category_id === action.payload);
        }
      }
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    clearFilters(state) {
      state.selectedCategory = null;
      state.selectedCategoryType = null;
      state.selectedCategoryName = null;
      state.searchTerm = '';
      state.filteredProducts = state.products;
    },
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchCategoriesByType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoriesByType.fulfilled, (state, action) => {
        state.loading = false;
        state.plantCategories = action.payload.plantCategories;
        state.accessoryCategories = action.payload.accessoryCategories;
        state.kitCategories = action.payload.kitCategories;
        state.error = null;
      })
      .addCase(fetchCategoriesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.products = action.payload;
          state.filteredProducts = action.payload;
          state.error = null;
        } else {
          state.loading = false;
          state.error = 'No se pudieron obtener los productos';
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload || [];
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { categoryId, products } = action.payload;
        state.productsByCategory = {
          ...state.productsByCategory,
          [categoryId]: products || [],
        };
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(searchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload || [];
        state.error = null;

        if (action.meta.arg) {
          state.searchTerm = action.meta.arg;
        }

        if (state.selectedCategory) {
          state.filteredProducts = state.filteredProducts.filter(
            (product) => product.category_id === state.selectedCategory
          );
        }
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory, setSearchTerm, clearFilters, clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;
