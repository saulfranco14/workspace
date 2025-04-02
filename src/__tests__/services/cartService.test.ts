import { mockSupabase, resetMocks } from '../__mocks__/supabaseMock';
import { Cart, CartItem } from '@/interfaces/cart.interface';

console.log = jest.fn();
console.error = jest.fn();

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

jest.mock('@/services/cart/cartDatabaseService', () => ({
  findCart: jest.fn(),
  createCart: jest.fn(),
  getCartById: jest.fn(),
  deleteCart: jest.fn(),
  updateCart: jest.fn(),
}));

jest.mock('@/services/cart/cartItemsService', () => ({
  insertCartItem: jest.fn(),
  getCartItemById: jest.fn(),
  getCartItem: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  getCartItemByProductId: jest.fn(),
  removeCartItem: jest.fn(),
  getCartItems: jest.fn(),
  clearCartItems: jest.fn(),
}));

jest.mock('@/services/deviceService', () => ({
  getFingerprint: jest.fn().mockResolvedValue('device-fingerprint-123'),
}));

import { findCart, createCart, getCartById, deleteCart, updateCart } from '@/services/cart/cartDatabaseService';
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
import { getFingerprint } from '@/services/deviceService';

import {
  getOrCreateCart,
  addItemToCart,
  updateCartItemQuantity as updateItemInCart,
  removeCartItem as removeItemFromCart,
  getCartWithItems,
  clearCart as emptyCart,
  migrateCart,
} from '@/services/cartService';

describe('Cart Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
  });

  describe('getOrCreateCart', () => {
    it('debe encontrar un carrito existente por userId', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (getFingerprint as jest.Mock).mockImplementationOnce(() => null);

      (findCart as jest.Mock).mockResolvedValue(mockCart);

      const result = await getOrCreateCart('user123');

      expect(findCart).toHaveBeenCalledWith('user123', undefined);
      expect(createCart).not.toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it('debe crear un nuevo carrito si no existe por userId', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (getFingerprint as jest.Mock).mockImplementationOnce(() => null);

      (findCart as jest.Mock).mockResolvedValue(null);
      (createCart as jest.Mock).mockResolvedValue(mockCart);

      const result = await getOrCreateCart('user123');

      expect(findCart).toHaveBeenCalledWith('user123', undefined);
      expect(createCart).toHaveBeenCalledWith('user123', undefined);
      expect(result).toEqual(mockCart);
    });

    it('debe usar fingerprint si no se proporciona userId', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: null,
        device_fingerprint: 'device-fingerprint-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (findCart as jest.Mock).mockResolvedValue(mockCart);

      const result = await getOrCreateCart();

      expect(getFingerprint).toHaveBeenCalled();
      expect(findCart).toHaveBeenCalledWith(undefined, 'device-fingerprint-123');
      expect(result).toEqual(mockCart);
    });

    it('debe crear carrito con fingerprint si no existe', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: null,
        device_fingerprint: 'device-fingerprint-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (findCart as jest.Mock).mockResolvedValue(null);
      (createCart as jest.Mock).mockResolvedValue(mockCart);

      const result = await getOrCreateCart();

      expect(getFingerprint).toHaveBeenCalled();
      expect(findCart).toHaveBeenCalledWith(undefined, 'device-fingerprint-123');
      expect(createCart).toHaveBeenCalledWith(undefined, 'device-fingerprint-123');
      expect(result).toEqual(mockCart);
    });

    it('debe manejar errores', async () => {
      (findCart as jest.Mock).mockRejectedValue(new Error('Error al buscar carrito'));

      const result = await getOrCreateCart('user123');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('addItemToCart', () => {
    it('debe actualizar cantidad si el producto ya existe en el carrito', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (getCartById as jest.Mock).mockResolvedValue(mockCart);
      (getCartItemByProductId as jest.Mock).mockResolvedValue(mockCartItem);
      (updateCartItemQuantity as jest.Mock).mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
      });
      (getCartItemById as jest.Mock).mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
      });

      const result = await addItemToCart('cart123', 'prod123', 1);

      expect(getCartItemByProductId).toHaveBeenCalledWith('cart123', 'prod123');
      expect(updateCartItemQuantity).toHaveBeenCalledWith('item123', 3);
      expect(insertCartItem).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...mockCartItem,
        quantity: 3,
      });
    });

    it('debe crear un nuevo item si el producto no existe en el carrito', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (getCartById as jest.Mock).mockResolvedValue(mockCart);
      (getCartItemByProductId as jest.Mock).mockResolvedValue(null);
      (insertCartItem as jest.Mock).mockResolvedValue(mockCartItem);
      (getCartItemById as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await addItemToCart('cart123', 'prod123', 2);

      expect(getCartItemByProductId).toHaveBeenCalledWith('cart123', 'prod123');
      expect(insertCartItem).toHaveBeenCalledWith('cart123', 'prod123', 2);
      expect(updateCartItemQuantity).not.toHaveBeenCalled();
      expect(result).toEqual(mockCartItem);
    });

    it('debe manejar errores', async () => {
      (getCartItemByProductId as jest.Mock).mockRejectedValue(new Error('Error al obtener item'));

      try {
        await addItemToCart('cart123', 'prod123', 1);
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('updateItemInCart', () => {
    it('debe actualizar la cantidad de un item en el carrito', async () => {
      const mockCartItem: CartItem = {
        id: 'item123',
        cart_id: 'cart123',
        product_id: 'prod123',
        quantity: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (updateCartItemQuantity as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await updateItemInCart('item123', 3);

      expect(updateCartItemQuantity).toHaveBeenCalledWith('item123', 3);
      expect(result).toEqual(mockCartItem);
    });

    it('debe manejar errores', async () => {
      (updateCartItemQuantity as jest.Mock).mockRejectedValue(new Error('Error al actualizar'));

      const result = await updateItemInCart('item123', 3);
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('removeItemFromCart', () => {
    it('debe eliminar un item del carrito', async () => {
      (removeCartItem as jest.Mock).mockResolvedValue(true);

      const result = await removeItemFromCart('item123');

      expect(removeCartItem).toHaveBeenCalledWith('item123');
      expect(result).toBe(true);
    });

    it('debe manejar errores', async () => {
      (removeCartItem as jest.Mock).mockRejectedValue(new Error('Error al eliminar'));

      const result = await removeItemFromCart('item123');
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartWithItems', () => {
    it('debe obtener el carrito con sus items', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

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
      ];

      (getCartById as jest.Mock).mockResolvedValue(mockCart);
      (getCartItems as jest.Mock).mockResolvedValue(mockCartItems);

      const result = await getCartWithItems('cart123');

      expect(getCartById).toHaveBeenCalledWith('cart123');
      expect(getCartItems).toHaveBeenCalledWith('cart123');
      expect(result).toEqual({
        cart: mockCart,
        items: mockCartItems,
      });
    });

    it('debe manejar errores', async () => {
      (getCartById as jest.Mock).mockResolvedValue(null);

      const result = await getCartWithItems('cart123');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('emptyCart', () => {
    it('debe vaciar el carrito', async () => {
      (clearCartItems as jest.Mock).mockResolvedValue(true);

      const result = await emptyCart('cart123');

      expect(clearCartItems).toHaveBeenCalledWith('cart123');
      expect(result).toBe(true);
    });

    it('debe manejar errores', async () => {
      (clearCartItems as jest.Mock).mockRejectedValue(new Error('Error al vaciar carrito'));

      const result = await emptyCart('cart123');
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('migrateCart', () => {
    it('debe migrar un carrito anónimo a un carrito de usuario', async () => {
      const mockAnonymousCart: Cart = {
        id: 'anon-cart123',
        user_id: null,
        device_fingerprint: 'device-fingerprint-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockUserCart: Cart = {
        id: 'user-cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockAnonItems: CartItem[] = [
        {
          id: 'anon-item123',
          cart_id: 'anon-cart123',
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
      ];

      (findCart as jest.Mock).mockImplementationOnce(() => mockAnonymousCart);
      (findCart as jest.Mock).mockImplementationOnce(() => mockUserCart);
      (getCartItems as jest.Mock).mockResolvedValue(mockAnonItems);
      (getCartItemByProductId as jest.Mock).mockResolvedValue(null);
      (insertCartItem as jest.Mock).mockResolvedValue({
        id: 'new-item123',
        cart_id: 'user-cart123',
        product_id: 'prod123',
        quantity: 2,
      });
      (deleteCart as jest.Mock).mockResolvedValue(true);

      const result = await migrateCart('user123', 'device-fingerprint-123');

      expect(findCart).toHaveBeenCalledWith(undefined, 'device-fingerprint-123');
      expect(findCart).toHaveBeenCalledWith('user123');
      expect(getCartItems).toHaveBeenCalledWith('anon-cart123');
      expect(insertCartItem).toHaveBeenCalledWith('user-cart123', 'prod123', 2);
      expect(deleteCart).toHaveBeenCalledWith('anon-cart123');
      expect(result.success).toBe(true);
    });

    it('debe manejar cuando no hay carrito anónimo', async () => {
      (findCart as jest.Mock).mockImplementationOnce(() => null);

      const result = await migrateCart('user123', 'device-fingerprint-123');

      expect(result.success).toBe(true);
      expect(findCart).toHaveBeenCalledTimes(1);
    });

    it('debe manejar cuando no hay carrito de usuario', async () => {
      const mockAnonymousCart: Cart = {
        id: 'anon-cart123',
        user_id: null,
        device_fingerprint: 'device-fingerprint-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (findCart as jest.Mock).mockImplementationOnce(() => mockAnonymousCart);
      (findCart as jest.Mock).mockImplementationOnce(() => null);
      (createCart as jest.Mock).mockResolvedValue({
        id: 'user-cart123',
        user_id: 'user123',
      });
      (getCartItems as jest.Mock).mockResolvedValue([]);
      (deleteCart as jest.Mock).mockResolvedValue(true);

      const result = await migrateCart('user123', 'device-fingerprint-123');

      expect(createCart).toHaveBeenCalledWith('user123');
      expect(result.success).toBe(true);
    });

    it('debe manejar errores', async () => {
      (findCart as jest.Mock).mockRejectedValue(new Error('Error al buscar carrito'));

      const result = await migrateCart('user123', 'device-fingerprint-123');
      expect(result.success).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
