import { CartItem, Cart } from '@/interfaces/cart.interface';

console.error = jest.fn();

const mockGetFingerprint = jest.fn().mockResolvedValue('fp123');
jest.mock('@/services/deviceService', () => ({
  getFingerprint: () => mockGetFingerprint(),
}));

const mockInsertCartItem = jest.fn();
const mockGetCartItemByProductId = jest.fn();
const mockUpdateCartItemQuantity = jest.fn();
const mockRemoveCartItem = jest.fn();
const mockClearCartItems = jest.fn();
const mockGetCartItems = jest.fn();
const mockGetCartItem = jest.fn();

jest.mock('@/services/cart/cartItemsService', () => ({
  insertCartItem: (...args: any[]) => mockInsertCartItem(...args),
  getCartItemByProductId: (...args: any[]) => mockGetCartItemByProductId(...args),
  updateCartItemQuantity: (...args: any[]) => mockUpdateCartItemQuantity(...args),
  removeCartItem: (...args: any[]) => mockRemoveCartItem(...args),
  clearCartItems: (...args: any[]) => mockClearCartItems(...args),
  getCartItems: (...args: any[]) => mockGetCartItems(...args),
  getCartItem: (...args: any[]) => mockGetCartItem(...args),
}));

const mockFindCart = jest.fn();
const mockCreateCart = jest.fn();
const mockGetCartById = jest.fn();
const mockDeleteCart = jest.fn();

jest.mock('@/services/cart/cartDatabaseService', () => ({
  findCart: (...args: any[]) => mockFindCart(...args),
  createCart: (...args: any[]) => mockCreateCart(...args),
  getCartById: (...args: any[]) => mockGetCartById(...args),
  deleteCart: (...args: any[]) => mockDeleteCart(...args),
}));

import {
  getOrCreateCart,
  migrateCart,
  getCartWithItems,
  addItemToCart,
  updateCartItemQuantity as updateQuantity,
  removeCartItem as removeItem,
  clearCart,
} from '@/services/cart/cartService';

describe('Cart Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (console.error as jest.Mock).mockClear();
  });

  describe('getOrCreateCart', () => {
    it('debe obtener un carrito existente por userId', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFindCart.mockResolvedValueOnce(mockCart);

      const result = await getOrCreateCart('user123');

      expect(mockFindCart).toHaveBeenCalledWith('user123', 'fp123');
      expect(mockCreateCart).not.toHaveBeenCalled();
      expect(result).toEqual(mockCart);
    });

    it('debe crear un carrito nuevo si no existe', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFindCart.mockResolvedValueOnce(null);
      mockCreateCart.mockResolvedValueOnce(mockCart);

      const result = await getOrCreateCart('user123');

      expect(mockFindCart).toHaveBeenCalledWith('user123', 'fp123');
      expect(mockCreateCart).toHaveBeenCalledWith('user123', 'fp123');
      expect(result).toEqual(mockCart);
    });

    it('debe usar fingerprint si no hay userId', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: null,
        device_fingerprint: 'fp123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFindCart.mockResolvedValueOnce(mockCart);

      const result = await getOrCreateCart();

      expect(mockFindCart).toHaveBeenCalledWith(undefined, 'fp123');
      expect(result).toEqual(mockCart);
    });

    it('debe manejar errores', async () => {
      mockGetFingerprint.mockRejectedValueOnce(new Error('Error al obtener fingerprint'));

      const result = await getOrCreateCart();

      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('migrateCart', () => {
    it('debe migrar items de carrito anónimo a carrito de usuario', async () => {
      const anonCart: Cart = {
        id: 'anon123',
        user_id: null,
        device_fingerprint: 'fp123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const userCart: Cart = {
        id: 'user123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const cartItems: CartItem[] = [
        {
          id: 'item1',
          cart_id: 'anon123',
          product_id: 'prod1',
          quantity: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockFindCart.mockImplementation((userId, fp) => {
        if (userId === 'user123') return Promise.resolve(userCart);
        if (fp === 'fp123') return Promise.resolve(anonCart);
        return Promise.resolve(null);
      });

      mockGetCartItems.mockResolvedValueOnce(cartItems);
      mockGetCartItemByProductId.mockResolvedValueOnce(null);
      mockInsertCartItem.mockResolvedValueOnce({ id: 'newItem1' });
      mockDeleteCart.mockResolvedValueOnce(true);

      const result = await migrateCart('user123', 'fp123');

      expect(mockFindCart).toHaveBeenCalledWith(undefined, 'fp123');
      expect(mockFindCart).toHaveBeenCalledWith('user123');
      expect(mockGetCartItems).toHaveBeenCalledWith('anon123');
      expect(mockGetCartItemByProductId).toHaveBeenCalledWith('user123', 'prod1');
      expect(mockInsertCartItem).toHaveBeenCalledWith('user123', 'prod1', 2);
      expect(mockDeleteCart).toHaveBeenCalledWith('anon123');
      expect(result).toEqual({ success: true });
    });

    it('debe retornar éxito si no hay carrito anónimo', async () => {
      mockFindCart.mockResolvedValueOnce(null);

      const result = await migrateCart('user123', 'fp123');

      expect(result).toEqual({ success: true });
      expect(mockDeleteCart).not.toHaveBeenCalled();
    });
  });

  describe('getCartWithItems', () => {
    it('debe obtener un carrito con sus items', async () => {
      const mockCart: Cart = {
        id: 'cart123',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockItems: CartItem[] = [
        {
          id: 'item1',
          cart_id: 'cart123',
          product_id: 'prod1',
          quantity: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockGetCartById.mockResolvedValueOnce(mockCart);
      mockGetCartItems.mockResolvedValueOnce(mockItems);

      const result = await getCartWithItems('cart123');

      expect(mockGetCartById).toHaveBeenCalledWith('cart123');
      expect(mockGetCartItems).toHaveBeenCalledWith('cart123');
      expect(result).toEqual({
        cart: mockCart,
        items: mockItems,
      });
    });

    it('debe manejar error si el carrito no existe', async () => {
      mockGetCartById.mockResolvedValueOnce(null);

      const result = await getCartWithItems('cart123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('addItemToCart', () => {
    const mockCart: Cart = {
      id: 'cart123',
      user_id: 'user123',
      device_fingerprint: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockCartItem: CartItem = {
      id: 'item1',
      cart_id: 'cart123',
      product_id: 'prod1',
      quantity: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    beforeEach(() => {
      mockGetCartById.mockResolvedValue(mockCart);
      mockGetCartItem.mockResolvedValue(mockCartItem);
    });

    it('debe añadir un nuevo item al carrito', async () => {
      mockGetCartItemByProductId.mockResolvedValueOnce(null);

      await addItemToCart('cart123', 'prod1', 2);

      expect(mockGetCartById).toHaveBeenCalledWith('cart123');
      expect(mockGetCartItemByProductId).toHaveBeenCalledWith('cart123', 'prod1');
      expect(mockInsertCartItem).toHaveBeenCalledWith('cart123', 'prod1', 2);
      expect(mockGetCartItem).toHaveBeenCalledWith('cart123', 'prod1');
    });

    it('debe incrementar la cantidad si el item ya existe', async () => {
      const existingItem: CartItem = {
        id: 'item1',
        cart_id: 'cart123',
        product_id: 'prod1',
        quantity: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockGetCartItemByProductId.mockResolvedValueOnce(existingItem);

      await addItemToCart('cart123', 'prod1', 2);

      expect(mockGetCartItemByProductId).toHaveBeenCalledWith('cart123', 'prod1');
      expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('item1', 5);
    });

    it('debe lanzar error si el carrito no existe', async () => {
      mockGetCartById.mockResolvedValueOnce(null);

      await expect(addItemToCart('cart123', 'prod1', 2)).rejects.toThrow('Cart does not exist');
    });
  });

  describe('updateCartItemQuantity', () => {
    it('debe actualizar la cantidad de un item', async () => {
      const mockCartItem: CartItem = {
        id: 'item1',
        cart_id: 'cart123',
        product_id: 'prod1',
        quantity: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockUpdateCartItemQuantity.mockResolvedValueOnce(mockCartItem);

      const result = await updateQuantity('item1', 5);

      expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('item1', 5);
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('removeCartItem', () => {
    it('debe eliminar un item del carrito', async () => {
      mockRemoveCartItem.mockResolvedValueOnce(true);

      const result = await removeItem('item1');

      expect(mockRemoveCartItem).toHaveBeenCalledWith('item1');
      expect(result).toBe(true);
    });
  });

  describe('clearCart', () => {
    it('debe vaciar un carrito', async () => {
      mockClearCartItems.mockResolvedValueOnce(true);

      const result = await clearCart('cart123');

      expect(mockClearCartItems).toHaveBeenCalledWith('cart123');
      expect(result).toBe(true);
    });
  });
});
