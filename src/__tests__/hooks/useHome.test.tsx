import React from 'react';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useHomeData } from '@/hooks/useHome';
import { Category, Product } from '@/interfaces/product.interface';

const mockFetchCategories = jest.fn().mockImplementation(() => () => Promise.resolve());
const mockFetchCategoriesByType = jest.fn().mockImplementation(() => () => Promise.resolve());
const mockFetchProducts = jest.fn().mockImplementation(() => () => Promise.resolve());
const mockFetchFeaturedProducts = jest.fn().mockImplementation(() => () => Promise.resolve());

jest.mock('@/store/products/thunk/productThunk', () => ({
  fetchCategories: jest.fn().mockImplementation(() => {
    return mockFetchCategories();
  }),
  fetchCategoriesByType: jest.fn().mockImplementation(() => {
    return mockFetchCategoriesByType();
  }),
  fetchProducts: jest.fn().mockImplementation(() => {
    return mockFetchProducts();
  }),
  fetchFeaturedProducts: jest.fn().mockImplementation(() => {
    return mockFetchFeaturedProducts();
  }),
}));

jest.mock('@/hooks/useSingleEffect', () => ({
  useSingleEffect: jest.fn().mockImplementation((fn) => fn()),
}));

interface ProductsState {
  categories: Category[];
  plantCategories: Category[];
  accessoryCategories: Category[];
  kitCategories: Category[];
  products: Product[];
  filteredProducts: Product[];
  featuredProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  selectedProduct: Product | null;
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
  selectedCategoryName: string | null;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

const mockProductsReducer = (
  state: ProductsState = {
    categories: [],
    plantCategories: [],
    accessoryCategories: [],
    kitCategories: [],
    products: [],
    filteredProducts: [],
    featuredProducts: [],
    productsByCategory: {},
    selectedProduct: null,
    selectedCategory: null,
    selectedCategoryType: null,
    selectedCategoryName: null,
    searchTerm: '',
    loading: false,
    error: null,
  },
  action: { type: string }
) => {
  return state;
};

const mockCategories: Category[] = [
  { id: 'cat1', name: 'Plantas', type: 'plant' },
  { id: 'cat2', name: 'Macetas', type: 'accessory' },
  { id: 'cat3', name: 'Kits', type: 'kit' },
];

const mockProducts: Product[] = [
  { id: 'prod1', name: 'Planta 1', description: 'Descripción 1', price: 10.99, category_id: 'cat1', stock: 10 },
  { id: 'prod2', name: 'Maceta 1', description: 'Descripción 2', price: 5.99, category_id: 'cat2', stock: 5 },
  {
    id: 'prod3',
    name: 'Kit 1',
    description: 'Descripción 3',
    price: 15.99,
    category_id: 'cat3',
    stock: 3,
    is_featured: true,
  },
];

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      products: mockProductsReducer,
    },
    preloadedState: {
      products: {
        categories: [],
        plantCategories: [],
        accessoryCategories: [],
        kitCategories: [],
        products: [],
        filteredProducts: [],
        featuredProducts: [],
        productsByCategory: {},
        selectedProduct: null,
        selectedCategory: null,
        selectedCategoryType: null,
        selectedCategoryName: null,
        searchTerm: '',
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }, store: any) => (
  <Provider store={store}>{children}</Provider>
);

describe('useHomeData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe cargar categorías y productos al inicializar', () => {
    const store = createTestStore();

    renderHook(() => useHomeData(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(mockFetchCategories).toHaveBeenCalled();
    expect(mockFetchCategoriesByType).toHaveBeenCalled();
    expect(mockFetchProducts).toHaveBeenCalled();
    expect(mockFetchFeaturedProducts).toHaveBeenCalled();
  });

  test('debe calcular correctamente los productos por tipo', () => {
    const store = createTestStore({
      categories: mockCategories,
      plantCategories: [mockCategories[0]],
      accessoryCategories: [mockCategories[1]],
      kitCategories: [mockCategories[2]],
      products: mockProducts,
      filteredProducts: mockProducts,
    });

    const { result } = renderHook(() => useHomeData(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.plantProducts).toHaveLength(1);
    expect(result.current.plantProducts[0].id).toBe('prod1');

    expect(result.current.accessoryProducts).toHaveLength(1);
    expect(result.current.accessoryProducts[0].id).toBe('prod2');

    expect(result.current.kitProducts).toHaveLength(1);
    expect(result.current.kitProducts[0].id).toBe('prod3');
  });

  test('debe identificar correctamente los productos destacados', () => {
    const store = createTestStore({
      categories: mockCategories,
      plantCategories: [mockCategories[0]],
      accessoryCategories: [mockCategories[1]],
      kitCategories: [mockCategories[2]],
      products: mockProducts,
      filteredProducts: mockProducts,
    });

    const { result } = renderHook(() => useHomeData(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.featuredKit).toBeDefined();
    expect(result.current.featuredKit?.id).toBe('prod3');
  });

  test('debe filtrar los productos cuando hay una categoría seleccionada', () => {
    const store = createTestStore({
      categories: mockCategories,
      plantCategories: [mockCategories[0]],
      accessoryCategories: [mockCategories[1]],
      kitCategories: [mockCategories[2]],
      products: mockProducts,
      filteredProducts: mockProducts,
      selectedCategory: 'cat1',
      selectedCategoryType: 'plant' as 'plant' | 'accessory' | 'kit' | null,
      selectedCategoryName: 'Plantas',
    });

    const { result } = renderHook(() => useHomeData(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.filteredPlantProducts).toHaveLength(1);
    expect(result.current.filteredPlantProducts[0].id).toBe('prod1');

    expect(result.current.filteredAccessoryProducts).toHaveLength(0);
  });
});
