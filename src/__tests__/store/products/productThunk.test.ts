import {
  fetchCategories,
  fetchCategoriesByType,
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductsByCategory,
  searchProductsThunk,
  fetchProductById,
} from '@/store/products/thunk/productThunk';
import * as productService from '@/productService';
import { Category, Product } from '@/interfaces/product.interface';

jest.mock('@/productService');

describe('ProductThunks', () => {
  const mockCategories: Category[] = [
    { id: 'cat1', name: 'Plantas', type: 'plant' },
    { id: 'cat2', name: 'Macetas', type: 'accessory' },
    { id: 'cat3', name: 'Kits', type: 'kit' },
  ];

  const mockProducts: Product[] = [
    { id: 'prod1', name: 'Planta 1', description: 'Descripción 1', price: 10.99, category_id: 'cat1', stock: 10 },
    { id: 'prod2', name: 'Maceta 1', description: 'Descripción 2', price: 5.99, category_id: 'cat2', stock: 5 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCategories', () => {
    test('debe obtener categorías con éxito', async () => {
      (productService.getCategories as jest.Mock).mockResolvedValue({
        data: mockCategories,
        error: null,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchCategories()(dispatch, getState, undefined);

      expect(productService.getCategories).toHaveBeenCalled();
      expect(result.payload).toEqual(mockCategories);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores', async () => {
      const errorMessage = 'Error al obtener categorías';
      (productService.getCategories as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchCategories()(dispatch, getState, undefined);

      expect(productService.getCategories).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('fetchCategoriesByType', () => {
    test('debe obtener categorías por tipo con éxito', async () => {
      const plantCategories = [mockCategories[0]];
      const accessoryCategories = [mockCategories[1]];
      const kitCategories = [mockCategories[2]];

      (productService.getCategoriesByType as jest.Mock).mockImplementation((types) => {
        if (types[0] === 'Plantas') {
          return Promise.resolve({
            data: plantCategories,
            error: null,
          });
        } else if (types.includes('Macetas')) {
          return Promise.resolve({
            data: accessoryCategories,
            error: null,
          });
        } else if (types[0] === 'Kits') {
          return Promise.resolve({
            data: kitCategories,
            error: null,
          });
        }
        return Promise.resolve({ data: [], error: null });
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchCategoriesByType()(dispatch, getState, undefined);

      expect(productService.getCategoriesByType).toHaveBeenCalledTimes(3);
      expect(result.payload).toEqual({
        plantCategories,
        accessoryCategories,
        kitCategories,
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores en plantas', async () => {
      const errorMessage = 'Error al obtener categorías de plantas';
      (productService.getCategoriesByType as jest.Mock).mockImplementation((types) => {
        if (types[0] === 'Plantas') {
          return Promise.resolve({
            data: null,
            error: { message: errorMessage },
          });
        }
        return Promise.resolve({ data: [], error: null });
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchCategoriesByType()(dispatch, getState, undefined);

      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('fetchProducts', () => {
    test('debe obtener productos con éxito', async () => {
      (productService.getProducts as jest.Mock).mockResolvedValue({
        data: mockProducts,
        error: null,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchProducts()(dispatch, getState, undefined);

      expect(productService.getProducts).toHaveBeenCalled();
      expect(result.payload).toEqual(mockProducts);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores', async () => {
      const errorMessage = 'Error al obtener productos';
      (productService.getProducts as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchProducts()(dispatch, getState, undefined);

      expect(productService.getProducts).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('fetchFeaturedProducts', () => {
    test('debe obtener productos destacados con éxito', async () => {
      const featuredProducts = [mockProducts[0]];

      (productService.getFeaturedProducts as jest.Mock).mockResolvedValue({
        data: featuredProducts,
        error: null,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchFeaturedProducts()(dispatch, getState, undefined);

      expect(productService.getFeaturedProducts).toHaveBeenCalled();
      expect(result.payload).toEqual(featuredProducts);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores', async () => {
      const errorMessage = 'Error al obtener productos destacados';
      (productService.getFeaturedProducts as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchFeaturedProducts()(dispatch, getState, undefined);

      expect(productService.getFeaturedProducts).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('fetchProductsByCategory', () => {
    test('debe obtener productos por categoría con éxito', async () => {
      const categoryProducts = [mockProducts[0]];

      (productService.getProductsByCategory as jest.Mock).mockResolvedValue({
        data: categoryProducts,
        error: null,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchProductsByCategory('cat1')(dispatch, getState, undefined);

      expect(productService.getProductsByCategory).toHaveBeenCalledWith('cat1');
      expect(result.payload).toEqual({
        categoryId: 'cat1',
        products: categoryProducts,
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores', async () => {
      const errorMessage = 'Error al obtener productos por categoría';
      (productService.getProductsByCategory as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchProductsByCategory('cat1')(dispatch, getState, undefined);

      expect(productService.getProductsByCategory).toHaveBeenCalledWith('cat1');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('searchProductsThunk', () => {
    test('debe buscar productos con éxito', async () => {
      const searchResults = [mockProducts[0]];

      (productService.searchProducts as jest.Mock).mockResolvedValue({
        data: searchResults,
        error: null,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await searchProductsThunk('planta')(dispatch, getState, undefined);

      expect(productService.searchProducts).toHaveBeenCalledWith('planta');
      expect(result.payload).toEqual(searchResults);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores', async () => {
      const errorMessage = 'Error al buscar productos';
      (productService.searchProducts as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await searchProductsThunk('planta')(dispatch, getState, undefined);

      expect(productService.searchProducts).toHaveBeenCalledWith('planta');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('fetchProductById', () => {
    test('debe obtener un producto por ID con éxito', async () => {
      (productService.getProductById as jest.Mock).mockResolvedValue({
        data: mockProducts[0],
        error: null,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchProductById('prod1')(dispatch, getState, undefined);

      expect(productService.getProductById).toHaveBeenCalledWith('prod1');
      expect(result.payload).toEqual(mockProducts[0]);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores', async () => {
      const errorMessage = 'Error al obtener producto por ID';
      (productService.getProductById as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchProductById('prod1')(dispatch, getState, undefined);

      expect(productService.getProductById).toHaveBeenCalledWith('prod1');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });
});
