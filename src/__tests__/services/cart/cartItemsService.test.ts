import {
  mockSupabase,
  resetMocks,
  mockFrom,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
} from '../../__mocks__/supabaseMock';
import { CartItem } from '@/interfaces/cart.interface';

console.error = jest.fn();

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

import {
  insertCartItem,
  getCartItemById,
  getCartItem,
  updateCartItemQuantity,
  getCartItemByProductId,
  removeCartItem,
  getCartItems,
  clearCartItems,
} from '@/services/cart/cartItemsService';

describe('Cart Items Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.error as jest.Mock).mockClear();
  });

  describe('insertCartItem', () => {
    it('debe insertar un item en el carrito correctamente', async () => {
      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockInsert.mockImplementation(() => ({
        error: null,
        data: mockCartItem,
      }));

      const result = await insertCartItem('cart123', 'prod123', 2);

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockInsert).toHaveBeenCalledWith({
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
      });
      expect(result).toEqual(mockCartItem);
    });

    it('debe usar cantidad por defecto si no se proporciona', async () => {
      mockInsert.mockImplementation(() => ({
        error: null,
        data: { id: 'item123' },
      }));

      await insertCartItem('cart123', 'prod123');

      expect(mockInsert).toHaveBeenCalledWith({
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 1,
      });
    });

    it('debe manejar errores al insertar un item', async () => {
      mockInsert.mockImplementation(() => ({
        error: new Error('Error al insertar item'),
        data: null,
      }));

      const result = await insertCartItem('cart123', 'prod123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartItemById', () => {
    it('debe obtener un item del carrito por su ID', async () => {
      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: 'prod123',
          name: 'Producto prueba',
          price: 100,
          image_url: 'imagen.jpg',
          stock: 10,
        },
      };

      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({
            data: mockCartItem,
            error: null,
          }),
        }),
      }));

      const result = await getCartItemById('item123');

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          stock
        )
      `);
      expect(result).toEqual(mockCartItem);
    });

    it('debe manejar errores al obtener un item', async () => {
      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({
            data: null,
            error: new Error('Error al obtener item'),
          }),
        }),
      }));

      const result = await getCartItemById('item123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartItem', () => {
    it('debe obtener un item por cart_id y product_id', async () => {
      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product: {
          id: 'prod123',
          name: 'Producto prueba',
          price: 100,
          image_url: 'imagen.jpg',
          stock: 10,
        },
      };

      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockReturnValue({
                  data: mockCartItem,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }));

      const result = await getCartItem('cart123', 'prod123');

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(result).toEqual(mockCartItem);
    });

    it('debe manejar errores al obtener un item por cart_id y product_id', async () => {
      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockReturnValue({
                  data: null,
                  error: new Error('Error al obtener item'),
                }),
              }),
            }),
          }),
        }),
      }));

      const result = await getCartItem('cart123', 'prod123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateCartItemQuantity', () => {
    it('debe actualizar la cantidad de un item correctamente', async () => {
      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockUpdate.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            data: [mockCartItem],
            error: null,
          }),
        }),
      }));

      const result = await updateCartItemQuantity('item123', 5);

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockUpdate).toHaveBeenCalledWith({ quantity: 5 });
      expect(result).toEqual(mockCartItem);
    });

    it('debe devolver null si no hay datos después de actualizar', async () => {
      mockUpdate.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            data: [],
            error: null,
          }),
        }),
      }));

      const result = await updateCartItemQuantity('item123', 5);

      expect(result).toBeNull();
    });

    it('debe manejar errores al actualizar la cantidad', async () => {
      mockUpdate.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            data: null,
            error: new Error('Error al actualizar cantidad'),
          }),
        }),
      }));

      const result = await updateCartItemQuantity('item123', 5);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartItemByProductId', () => {
    it('debe obtener un item por cart_id y product_id', async () => {
      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockReturnValue({
              data: mockCartItem,
              error: null,
            }),
          }),
        }),
      }));

      const result = await getCartItemByProductId('cart123', 'prod123');

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockCartItem);
    });

    it('debe manejar errores al buscar item por product_id', async () => {
      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockReturnValue({
              data: null,
              error: new Error('Error al buscar item por producto'),
            }),
          }),
        }),
      }));

      const result = await getCartItemByProductId('cart123', 'prod123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('removeCartItem', () => {
    it('debe eliminar un item correctamente', async () => {
      mockDelete.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          error: null,
        }),
      }));

      const result = await removeCartItem('item123');

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debe manejar errores al eliminar un item', async () => {
      mockDelete.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          error: new Error('Error al eliminar item'),
        }),
      }));

      const result = await removeCartItem('item123');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartItems', () => {
    it('debe obtener todos los items de un carrito', async () => {
      const mockCartItems: CartItem[] = [
        {
          id: 'item123',
          cart_id: 'cart123',
          product_id: 'prod123',
          quantity: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product: {
            id: 'prod123',
            name: 'Producto 1',
            price: 100,
            image_url: 'imagen1.jpg',
            stock: 10,
          },
        },
        {
          id: 'item456',
          cart_id: 'cart123',
          product_id: 'prod456',
          quantity: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product: {
            id: 'prod456',
            name: 'Producto 2',
            price: 200,
            image_url: 'imagen2.jpg',
            stock: 5,
          },
        },
      ];

      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          data: mockCartItems,
          error: null,
        }),
      }));

      const result = await getCartItems('cart123');

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          stock
        )
      `);
      expect(result).toEqual(mockCartItems);
    });

    it('debe manejar errores al obtener items del carrito', async () => {
      mockSelect.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Error al obtener items'),
        }),
      }));

      const result = await getCartItems('cart123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearCartItems', () => {
    it('debe vaciar todos los items de un carrito', async () => {
      mockDelete.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          error: null,
        }),
      }));

      const result = await clearCartItems('cart123');

      expect(mockFrom).toHaveBeenCalledWith('cart_items');
      expect(mockDelete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debe manejar errores al vaciar el carrito', async () => {
      mockDelete.mockImplementation(() => ({
        eq: jest.fn().mockReturnValue({
          error: new Error('Error al vaciar el carrito'),
        }),
      }));

      const result = await clearCartItems('cart123');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
