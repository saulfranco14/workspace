import productsReducer, {
  setSelectedCategory,
  setSearchTerm,
  clearFilters,
} from '@/store/products/slices/productsSlice';
import { initialState } from '@/store/products/initialState';
import {
  fetchCategories,
  fetchCategoriesByType,
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductsByCategory,
  searchProductsThunk,
  fetchProductById,
} from '@/store/products/thunk/productThunk';
import { Category, Product } from '@/interfaces/product.interface';

describe('ProductsSlice reducers', () => {
  test('debe devolver el estado inicial', () => {
    expect(productsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('setSelectedCategory debe establecer la categoría seleccionada y filtrar productos', () => {
    const mockCategories: Category[] = [
      { id: 'cat1', name: 'Plantas', type: 'plant' },
      { id: 'cat2', name: 'Macetas', type: 'accessory' },
    ];

    const mockProducts: Product[] = [
      { id: 'prod1', name: 'Planta 1', description: 'Descripción 1', price: 10.99, category_id: 'cat1', stock: 10 },
      { id: 'prod2', name: 'Maceta 1', description: 'Descripción 2', price: 5.99, category_id: 'cat2', stock: 5 },
    ];

    const stateWithProductsAndCategories = {
      ...initialState,
      products: mockProducts,
      filteredProducts: mockProducts,
      categories: mockCategories,
    };

    const stateWithSelectedCategory = productsReducer(stateWithProductsAndCategories, setSelectedCategory('cat1'));

    expect(stateWithSelectedCategory.selectedCategory).toBe('cat1');
    expect(stateWithSelectedCategory.selectedCategoryType).toBe('plant');
    expect(stateWithSelectedCategory.selectedCategoryName).toBe('Plantas');
    expect(stateWithSelectedCategory.filteredProducts).toHaveLength(1);
    expect(stateWithSelectedCategory.filteredProducts[0].id).toBe('prod1');

    const stateWithoutSelectedCategory = productsReducer(stateWithSelectedCategory, setSelectedCategory(null));

    expect(stateWithoutSelectedCategory.selectedCategory).toBeNull();
    expect(stateWithoutSelectedCategory.selectedCategoryType).toBeNull();
    expect(stateWithoutSelectedCategory.selectedCategoryName).toBeNull();
    expect(stateWithoutSelectedCategory.filteredProducts).toHaveLength(2); // Todos los productos
  });

  test('setSearchTerm debe establecer el término de búsqueda', () => {
    const stateWithSearchTerm = productsReducer(initialState, setSearchTerm('planta'));

    expect(stateWithSearchTerm.searchTerm).toBe('planta');
  });

  test('clearFilters debe restablecer los filtros y mostrar todos los productos', () => {
    const mockProducts: Product[] = [
      { id: 'prod1', name: 'Planta 1', description: 'Descripción 1', price: 10.99, category_id: 'cat1', stock: 10 },
      { id: 'prod2', name: 'Maceta 1', description: 'Descripción 2', price: 5.99, category_id: 'cat2', stock: 5 },
    ];

    const stateWithFilters = {
      ...initialState,
      products: mockProducts,
      filteredProducts: [mockProducts[0]],
      selectedCategory: 'cat1',
      selectedCategoryType: 'plant' as 'plant' | 'accessory' | 'kit' | null,
      selectedCategoryName: 'Plantas',
      searchTerm: 'planta',
    };

    const clearedState = productsReducer(stateWithFilters, clearFilters());

    expect(clearedState.selectedCategory).toBeNull();
    expect(clearedState.selectedCategoryType).toBeNull();
    expect(clearedState.selectedCategoryName).toBeNull();
    expect(clearedState.searchTerm).toBe('');
    expect(clearedState.filteredProducts).toEqual(mockProducts);
  });
});

describe('ProductsSlice extraReducers', () => {
  const mockCategories: Category[] = [
    { id: 'cat1', name: 'Plantas', type: 'plant' },
    { id: 'cat2', name: 'Macetas', type: 'accessory' },
    { id: 'cat3', name: 'Kits', type: 'kit' },
  ];

  const mockProducts: Product[] = [
    { id: 'prod1', name: 'Planta 1', description: 'Descripción 1', price: 10.99, category_id: 'cat1', stock: 10 },
    { id: 'prod2', name: 'Maceta 1', description: 'Descripción 2', price: 5.99, category_id: 'cat2', stock: 5 },
  ];

  describe('fetchCategories', () => {
    test('fetchCategories.pending debe establecer loading', () => {
      const action = { type: fetchCategories.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    test('fetchCategories.fulfilled debe actualizar las categorías', () => {
      const action = {
        type: fetchCategories.fulfilled.type,
        payload: mockCategories,
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.categories).toEqual(mockCategories);
      expect(state.error).toBeNull();
    });

    test('fetchCategories.rejected debe manejar errores', () => {
      const action = {
        type: fetchCategories.rejected.type,
        payload: 'Error al obtener categorías',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al obtener categorías');
    });
  });

  describe('fetchCategoriesByType', () => {
    test('fetchCategoriesByType.pending debe establecer loading', () => {
      const action = { type: fetchCategoriesByType.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    test('fetchCategoriesByType.fulfilled debe actualizar las categorías por tipo', () => {
      const plantCategories = [mockCategories[0]];
      const accessoryCategories = [mockCategories[1]];
      const kitCategories = [mockCategories[2]];

      const action = {
        type: fetchCategoriesByType.fulfilled.type,
        payload: {
          plantCategories,
          accessoryCategories,
          kitCategories,
        },
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.plantCategories).toEqual(plantCategories);
      expect(state.accessoryCategories).toEqual(accessoryCategories);
      expect(state.kitCategories).toEqual(kitCategories);
      expect(state.error).toBeNull();
    });

    test('fetchCategoriesByType.rejected debe manejar errores', () => {
      const action = {
        type: fetchCategoriesByType.rejected.type,
        payload: 'Error al obtener categorías por tipo',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al obtener categorías por tipo');
    });
  });

  describe('fetchProducts', () => {
    test('fetchProducts.pending debe establecer loading', () => {
      const action = { type: fetchProducts.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    test('fetchProducts.fulfilled debe actualizar los productos', () => {
      const action = {
        type: fetchProducts.fulfilled.type,
        payload: mockProducts,
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.products).toEqual(mockProducts);
      expect(state.filteredProducts).toEqual(mockProducts);
      expect(state.error).toBeNull();
    });

    test('fetchProducts.rejected debe manejar errores', () => {
      const action = {
        type: fetchProducts.rejected.type,
        payload: 'Error al obtener productos',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al obtener productos');
    });
  });

  describe('fetchFeaturedProducts', () => {
    test('fetchFeaturedProducts.pending debe establecer loading', () => {
      const action = { type: fetchFeaturedProducts.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    test('fetchFeaturedProducts.fulfilled debe actualizar los productos destacados', () => {
      const featuredProducts = [mockProducts[0]];

      const action = {
        type: fetchFeaturedProducts.fulfilled.type,
        payload: featuredProducts,
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.featuredProducts).toEqual(featuredProducts);
      expect(state.error).toBeNull();
    });

    test('fetchFeaturedProducts.rejected debe manejar errores', () => {
      const action = {
        type: fetchFeaturedProducts.rejected.type,
        payload: 'Error al obtener productos destacados',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al obtener productos destacados');
    });
  });

  describe('fetchProductsByCategory', () => {
    test('fetchProductsByCategory.pending debe establecer loading', () => {
      const action = { type: fetchProductsByCategory.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    test('fetchProductsByCategory.fulfilled debe actualizar los productos por categoría', () => {
      const categoryProducts = [mockProducts[0]];

      const action = {
        type: fetchProductsByCategory.fulfilled.type,
        payload: {
          categoryId: 'cat1',
          products: categoryProducts,
        },
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.productsByCategory).toEqual({
        cat1: categoryProducts,
      });
      expect(state.error).toBeNull();

      const categoryProducts2 = [mockProducts[1]];

      const action2 = {
        type: fetchProductsByCategory.fulfilled.type,
        payload: {
          categoryId: 'cat2',
          products: categoryProducts2,
        },
      };

      const state2 = productsReducer(state, action2);

      expect(state2.productsByCategory).toEqual({
        cat1: categoryProducts,
        cat2: categoryProducts2,
      });
    });

    test('fetchProductsByCategory.rejected debe manejar errores', () => {
      const action = {
        type: fetchProductsByCategory.rejected.type,
        payload: 'Error al obtener productos por categoría',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al obtener productos por categoría');
    });
  });

  describe('searchProductsThunk', () => {
    test('searchProductsThunk.pending debe establecer loading y resetear errores', () => {
      const action = { type: searchProductsThunk.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('searchProductsThunk.fulfilled debe actualizar los productos filtrados', () => {
      const searchResults = [mockProducts[0]];

      const action = {
        type: searchProductsThunk.fulfilled.type,
        payload: searchResults,
        meta: { arg: 'planta' },
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.filteredProducts).toEqual(searchResults);
      expect(state.searchTerm).toBe('planta');
      expect(state.error).toBeNull();
    });

    test('searchProductsThunk.fulfilled debe filtrar por categoría seleccionada', () => {
      const searchResults = mockProducts;

      const stateWithSelectedCategory = {
        ...initialState,
        selectedCategory: 'cat1',
      };

      const action = {
        type: searchProductsThunk.fulfilled.type,
        payload: searchResults,
        meta: { arg: 'producto' },
      };

      const state = productsReducer(stateWithSelectedCategory, action);

      expect(state.filteredProducts).toHaveLength(1);
      expect(state.filteredProducts[0].id).toBe('prod1');
    });

    test('searchProductsThunk.rejected debe manejar errores', () => {
      const action = {
        type: searchProductsThunk.rejected.type,
        payload: 'Error al buscar productos',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al buscar productos');
    });
  });

  describe('fetchProductById', () => {
    test('fetchProductById.pending debe establecer loading y resetear errores', () => {
      const action = { type: fetchProductById.pending.type };
      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fetchProductById.fulfilled debe actualizar el producto seleccionado', () => {
      const product = mockProducts[0];

      const action = {
        type: fetchProductById.fulfilled.type,
        payload: product,
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.selectedProduct).toEqual(product);
      expect(state.error).toBeNull();
    });

    test('fetchProductById.rejected debe manejar errores', () => {
      const action = {
        type: fetchProductById.rejected.type,
        payload: 'Error al obtener producto por ID',
      };

      const state = productsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error al obtener producto por ID');
    });
  });
});
