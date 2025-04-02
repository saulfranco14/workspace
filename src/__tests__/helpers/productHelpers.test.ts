import {
  filterProductsByCategory,
  getCategoryType,
  getFilteredProductsByType,
  shouldShowSection,
  formatCategory,
  formatProduct,
  handleError,
} from '@/helpers/productHelpers';
import { Category, Product } from '@/interfaces/product.interface';

describe('productHelpers', () => {
  const mockProducts: Product[] = [
    { id: '1', name: 'Planta 1', category_id: 'cat1', price: 100, stock: 10, description: 'Desc 1' },
    { id: '2', name: 'Planta 2', category_id: 'cat2', price: 200, stock: 5, description: 'Desc 2' },
    { id: '3', name: 'Maceta 1', category_id: 'cat3', price: 50, stock: 20, description: 'Desc 3' },
    { id: '4', name: 'Kit 1', category_id: 'cat4', price: 300, stock: 2, description: 'Desc 4' },
    { id: '5', name: 'Planta 3', category_id: '', price: 150, stock: 8, description: 'Desc 5' },
  ];

  const plantCategories: Category[] = [
    { id: 'cat1', name: 'Plantas Interior', type: 'plant' },
    { id: 'cat2', name: 'Plantas Exterior', type: 'plant' },
  ];

  const accessoryCategories: Category[] = [{ id: 'cat3', name: 'Macetas', type: 'accessory' }];

  const kitCategories: Category[] = [{ id: 'cat4', name: 'Kits de cultivo', type: 'kit' }];

  describe('filterProductsByCategory', () => {
    it('debe filtrar productos por categoría', () => {
      const result = filterProductsByCategory(mockProducts, ['cat1', 'cat2']);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('debe devolver un array vacío si no hay productos', () => {
      const result = filterProductsByCategory([], ['cat1']);
      expect(result).toEqual([]);
    });

    it('debe excluir productos sin category_id', () => {
      const result = filterProductsByCategory(mockProducts, ['cat1', 'cat5']);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('getCategoryType', () => {
    it('debe devolver null cuando no hay categoría seleccionada', () => {
      const result = getCategoryType(null, plantCategories, accessoryCategories, kitCategories);
      expect(result).toBeNull();
    });

    it('debe identificar correctamente una categoría de planta', () => {
      const result = getCategoryType('cat1', plantCategories, accessoryCategories, kitCategories);
      expect(result).toBe('plant');
    });

    it('debe identificar correctamente una categoría de accesorio', () => {
      const result = getCategoryType('cat3', plantCategories, accessoryCategories, kitCategories);
      expect(result).toBe('accessory');
    });

    it('debe identificar correctamente una categoría de kit', () => {
      const result = getCategoryType('cat4', plantCategories, accessoryCategories, kitCategories);
      expect(result).toBe('kit');
    });

    it('debe devolver null para una categoría desconocida', () => {
      const result = getCategoryType('cat99', plantCategories, accessoryCategories, kitCategories);
      expect(result).toBeNull();
    });
  });

  describe('getFilteredProductsByType', () => {
    const plantProducts = mockProducts.filter((p) => p.category_id === 'cat1' || p.category_id === 'cat2');

    it('debe devolver productos por tipo cuando no hay categoría seleccionada', () => {
      const result = getFilteredProductsByType(mockProducts, plantProducts, null, null, 'plant');
      expect(result).toEqual(plantProducts);
    });

    it('debe filtrar productos por categoría cuando coincide el tipo', () => {
      const result = getFilteredProductsByType(mockProducts, plantProducts, 'cat1', 'plant', 'plant');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('debe devolver array vacío cuando el tipo seleccionado no coincide', () => {
      const result = getFilteredProductsByType(mockProducts, plantProducts, 'cat1', 'plant', 'accessory');
      expect(result).toEqual([]);
    });
  });

  describe('shouldShowSection', () => {
    it('debe mostrar la sección cuando no hay categoría seleccionada', () => {
      const result = shouldShowSection(null, null, 'plant');
      expect(result).toBe(true);
    });

    it('debe mostrar la sección cuando el tipo coincide con la categoría seleccionada', () => {
      const result = shouldShowSection('cat1', 'plant', 'plant');
      expect(result).toBe(true);
    });

    it('no debe mostrar la sección cuando el tipo no coincide con la categoría seleccionada', () => {
      const result = shouldShowSection('cat1', 'plant', 'accessory');
      expect(result).toBe(false);
    });
  });

  describe('formatCategory', () => {
    it('debe formatear correctamente una categoría completa', () => {
      const category = { id: 'cat1', name: 'Plantas', type: 'plant' as const };
      const result = formatCategory(category);
      expect(result).toEqual(category);
    });

    it('debe asignar valores por defecto a campos faltantes', () => {
      const category = { id: 'cat1' };
      const result = formatCategory(category);
      expect(result).toEqual({
        id: 'cat1',
        name: '',
        type: 'plant',
      });
    });
  });

  describe('formatProduct', () => {
    it('debe formatear correctamente un producto completo', () => {
      const product = {
        id: '1',
        name: 'Planta',
        price: 100,
        stock: 10,
        category_id: 'cat1',
        description: 'Desc',
      };
      const result = formatProduct(product);
      expect(result).toEqual(product);
    });

    it('debe asignar valores por defecto a campos faltantes', () => {
      const product = { id: '1' };
      const result = formatProduct(product);
      expect(result).toEqual({
        id: '1',
        name: '',
        price: 0,
        stock: 0,
        category_id: '',
        description: '',
      });
    });

    it('debe formatear la categoría si está presente', () => {
      const product = {
        id: '1',
        name: 'Planta',
        category: { id: 'cat1', name: 'Plantas', type: 'plant' as const },
      };
      const result = formatProduct(product);
      expect(result.category).toEqual({
        id: 'cat1',
        name: 'Plantas',
        type: 'plant',
      });
    });
  });

  describe('handleError', () => {
    const originalConsoleError = console.error;

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    it('debe devolver objeto con error y data null', () => {
      const error = new Error('Test error');
      const result = handleError<Product>(error, 'obtener productos');

      expect(result).toEqual({
        data: null,
        error: error,
      });
      expect(console.error).toHaveBeenCalledWith('Error al obtener productos:', error);
    });
  });
});
