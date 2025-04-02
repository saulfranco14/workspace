import { mockSupabase, resetMocks, mockFrom, mockSelect, mockEq, mockMaybeSingle } from '../__mocks__/supabaseMock';

console.error = jest.fn();

jest.mock('@/helpers/productHelpers', () => ({
  handleError: jest.fn().mockImplementation((error, operation) => {
    console.error(`Error al ${operation}:`, error);
    return {
      data: null,
      error: new Error(`Error al ${operation}: ${error}`),
    };
  }),
  formatProduct: jest.fn().mockImplementation((product) => ({
    id: product.id || '',
    name: product.name || '',
    price: product.price || 0,
    stock: product.stock || 0,
    category_id: product.category_id || '',
    description: product.description || '',
    image_url: product.image_url || undefined,
    category: product.category
      ? {
          ...product.category,
          type: 'plant',
        }
      : undefined,
  })),
  formatCategory: jest.fn().mockImplementation((category) => ({
    ...category,
    type: 'plant',
  })),
}));

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getCategories,
  getCategoriesByType,
  getProductsByCategories,
} from '@/services/productService';
import { handleError } from '@/helpers/productHelpers';

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.error as jest.Mock).mockClear();
  });

  describe('getProducts', () => {
    it('debe obtener todos los productos', async () => {
      const mockProductsDb = [
        {
          id: 'prod1',
          name: 'Planta 1',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
        },
        {
          id: 'prod2',
          name: 'Planta 2',
          description: 'Descripción 2',
          price: 150,
          stock: 5,
          category_id: 'cat2',
        },
      ];

      const mockProductsFormatted = [
        {
          id: 'prod1',
          name: 'Planta 1',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
          image_url: undefined,
          category: undefined,
        },
        {
          id: 'prod2',
          name: 'Planta 2',
          description: 'Descripción 2',
          price: 150,
          stock: 5,
          category_id: 'cat2',
          image_url: undefined,
          category: undefined,
        },
      ];

      mockSelect.mockImplementation(() => ({
        order: jest.fn().mockReturnValue({
          data: mockProductsDb,
          error: null,
        }),
      }));

      const result = await getProducts();

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(mockSelect).toHaveBeenCalledWith(`
      *,
      category:categories(id, name, description)
    `);
      expect(result.data).toEqual(mockProductsFormatted);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores', async () => {
      const mockError = new Error('Error de conexión');

      mockSelect.mockImplementation(() => ({
        order: jest.fn().mockReturnValue({
          data: null,
          error: mockError,
        }),
      }));

      const result = await getProducts();

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
      expect(handleError).toHaveBeenCalledWith(mockError, 'obtener productos');
    });
  });

  describe('getProductById', () => {
    it('debe obtener un producto por su ID', async () => {
      const mockProductDb = {
        id: 'prod1',
        name: 'Planta 1',
        description: 'Descripción',
        price: 100,
        stock: 10,
        category_id: 'cat1',
        category: {
          id: 'cat1',
          name: 'Plantas',
          description: 'Categoría de plantas',
        },
      };

      const mockProduct = {
        id: 'prod1',
        name: 'Planta 1',
        description: 'Descripción',
        price: 100,
        stock: 10,
        category_id: 'cat1',
        image_url: undefined,
        category: {
          id: 'cat1',
          name: 'Plantas',
          description: 'Categoría de plantas',
          type: 'plant',
        },
      };

      mockMaybeSingle.mockReturnValue({
        data: mockProductDb,
        error: null,
      });

      const result = await getProductById('prod1');

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        category:categories(id, name, description)
      `);
      expect(mockEq).toHaveBeenCalledWith('id', 'prod1');
      expect(result.data).toEqual(mockProduct);
      expect(result.error).toBeNull();
    });

    it('debe devolver null si no encuentra el producto', async () => {
      mockMaybeSingle.mockReturnValue({
        data: null,
        error: null,
      });

      const result = await getProductById('nonexistent');

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });

  describe('getFeaturedProducts', () => {
    it('debe obtener productos destacados', async () => {
      const mockProductsDb = [
        {
          id: 'prod1',
          name: 'Planta Destacada',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
          is_featured: true,
        },
      ];

      const mockProductsFormatted = [
        {
          id: 'prod1',
          name: 'Planta Destacada',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
          image_url: undefined,
          category: undefined,
        },
      ];

      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            data: mockProductsDb,
            error: null,
          }),
        }),
      }));

      const result = await getFeaturedProducts();

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(result.data).toEqual(mockProductsFormatted);
      expect(result.error).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    it('debe obtener productos por categoría', async () => {
      const mockProductsDb = [
        {
          id: 'prod1',
          name: 'Planta 1',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
        },
      ];

      const mockProductsFormatted = [
        {
          id: 'prod1',
          name: 'Planta 1',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
          image_url: undefined,
          category: undefined,
        },
      ];

      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: mockProductsDb,
            error: null,
          }),
        }),
      }));

      const result = await getProductsByCategory('cat1');

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(result.data).toEqual(mockProductsFormatted);
      expect(result.error).toBeNull();
    });
  });

  describe('searchProducts', () => {
    it('debe buscar productos por término', async () => {
      const mockProductsDb = [
        {
          id: 'prod1',
          name: 'Suculenta',
          description: 'Planta suculenta',
          price: 100,
          stock: 10,
          category_id: 'cat1',
        },
      ];

      const mockProductsFormatted = [
        {
          id: 'prod1',
          name: 'Suculenta',
          description: 'Planta suculenta',
          price: 100,
          stock: 10,
          category_id: 'cat1',
          image_url: undefined,
          category: undefined,
        },
      ];

      mockSelect.mockImplementation(() => ({
        ilike: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: mockProductsDb,
            error: null,
          }),
        }),
      }));

      const result = await searchProducts('suculenta');

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(result.data).toEqual(mockProductsFormatted);
      expect(result.error).toBeNull();
    });
  });

  describe('getCategories', () => {
    it('debe obtener todas las categorías', async () => {
      const mockCategoriesData = [
        {
          id: 'cat1',
          name: 'Plantas',
          type: 'plant',
          description: 'Categoría de plantas',
        },
        {
          id: 'cat2',
          name: 'Accesorios',
          type: 'accessory',
          description: 'Categoría de accesorios',
        },
      ];

      mockSelect.mockImplementation(() => ({
        order: jest.fn().mockReturnValue({
          data: mockCategoriesData.map((item) => ({
            ...item,
            type: item.name,
          })),
          error: null,
        }),
      }));

      const result = await getCategories();

      expect(mockFrom).toHaveBeenCalledWith('categories');
      expect(mockSelect).toHaveBeenCalledWith('*, type:name');
      expect(result.data).toHaveLength(2);
      expect(result.error).toBeNull();
    });
  });

  describe('getCategoriesByType', () => {
    it('debe obtener categorías filtradas por tipo', async () => {
      const mockCategoriesData = [
        {
          id: 'cat1',
          name: 'Plantas',
          type: 'plant',
          description: 'Categoría de plantas',
        },
      ];

      mockSelect.mockImplementation(() => ({
        or: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: mockCategoriesData.map((item) => ({
              ...item,
              type: item.name,
            })),
            error: null,
          }),
        }),
      }));

      const result = await getCategoriesByType(['plant']);

      expect(mockFrom).toHaveBeenCalledWith('categories');
      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });
  });

  describe('getProductsByCategories', () => {
    it('debe obtener productos de múltiples categorías', async () => {
      const mockProductsDb = [
        {
          id: 'prod1',
          name: 'Producto 1',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
        },
        {
          id: 'prod2',
          name: 'Producto 2',
          description: 'Descripción 2',
          price: 150,
          stock: 5,
          category_id: 'cat2',
        },
      ];

      const mockProductsFormatted = [
        {
          id: 'prod1',
          name: 'Producto 1',
          description: 'Descripción',
          price: 100,
          stock: 10,
          category_id: 'cat1',
          image_url: undefined,
          category: undefined,
        },
        {
          id: 'prod2',
          name: 'Producto 2',
          description: 'Descripción 2',
          price: 150,
          stock: 5,
          category_id: 'cat2',
          image_url: undefined,
          category: undefined,
        },
      ];

      mockSelect.mockImplementation(() => ({
        in: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: mockProductsDb,
            error: null,
          }),
        }),
      }));

      const result = await getProductsByCategories(['cat1', 'cat2']);

      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(result.data).toEqual(mockProductsFormatted);
      expect(result.error).toBeNull();
    });
  });
});
