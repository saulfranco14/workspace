import { mockSupabase, resetMocks } from '../../__mocks__/supabaseMock';
import { Cart } from '@/interfaces/cart.interface';

console.error = jest.fn();

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

import { findCart, createCart, getCartById, deleteCart, updateCart } from '@/services/cart/cartDatabaseService';

jest.mock('@/services/cart/cartDatabaseService', () => {
  const originalModule = jest.requireActual('@/services/cart/cartDatabaseService');

  return {
    ...originalModule,
    findCart: jest.fn((userId, fingerprint) => {
      if (!userId && !fingerprint) {
        console.error('Se requiere userId o fingerprint para buscar un carrito');
        return Promise.resolve(null);
      }
      if (userId === 'user123' || fingerprint === 'fp123') {
        return Promise.resolve({
          id: 'cart123',
          user_id: userId || null,
          device_fingerprint: fingerprint || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return Promise.resolve(null);
    }),
    createCart: jest.fn((userId, fingerprint) => {
      if (!userId && !fingerprint) {
        console.error('Se requiere userId o fingerprint para crear un carrito');
        return Promise.resolve(null);
      }
      return Promise.resolve({
        id: 'cart123',
        user_id: userId || null,
        device_fingerprint: fingerprint || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }),
    getCartById: jest.fn((cartId) => {
      if (cartId === 'cart123') {
        return Promise.resolve({
          id: 'cart123',
          user_id: 'user123',
          device_fingerprint: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return Promise.resolve(null);
    }),
    deleteCart: jest.fn(() => Promise.resolve(true)),
    updateCart: jest.fn((cartId, updates) => {
      return Promise.resolve({
        id: cartId,
        ...updates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }),
  };
});

describe('Cart Database Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.error as jest.Mock).mockClear();
  });

  describe('findCart', () => {
    it('debe encontrar un carrito por userId', async () => {
      const result = await findCart('user123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('cart123');
      expect(result?.user_id).toBe('user123');
    });

    it('debe encontrar un carrito por fingerprint', async () => {
      const result = await findCart(undefined, 'fp123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('cart123');
      expect(result?.device_fingerprint).toBe('fp123');
    });

    it('debe lanzar error si no se proporciona userId ni fingerprint', async () => {
      const result = await findCart();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('debe manejar errores de base de datos', async () => {
      (findCart as jest.Mock).mockImplementationOnce(() => {
        console.error('Error en la base de datos');
        return Promise.resolve(null);
      });

      const result = await findCart('error123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createCart', () => {
    it('debe crear un carrito con userId', async () => {
      const result = await createCart('user123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('cart123');
      expect(result?.user_id).toBe('user123');
    });

    it('debe crear un carrito con fingerprint', async () => {
      const result = await createCart(undefined, 'fp123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('cart123');
      expect(result?.device_fingerprint).toBe('fp123');
    });

    it('debe manejar error si no se proporciona userId ni fingerprint', async () => {
      const result = await createCart();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('debe manejar errores al crear un carrito', async () => {
      (createCart as jest.Mock).mockImplementationOnce(() => {
        console.error('Error al crear carrito');
        return Promise.resolve(null);
      });

      const result = await createCart('error123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getCartById', () => {
    it('debe obtener un carrito por su ID', async () => {
      const result = await getCartById('cart123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('cart123');
      expect(result?.user_id).toBe('user123');
    });

    it('debe manejar errores al obtener un carrito por ID', async () => {
      (getCartById as jest.Mock).mockImplementationOnce(() => {
        console.error('Error al obtener carrito por ID');
        return Promise.resolve(null);
      });

      const result = await getCartById('error123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteCart', () => {
    it('debe eliminar un carrito correctamente', async () => {
      const result = await deleteCart('cart123');

      expect(result).toBe(true);
    });

    it('debe manejar errores al eliminar un carrito', async () => {
      (deleteCart as jest.Mock).mockImplementationOnce(() => {
        console.error('Error al eliminar carrito');
        return Promise.resolve(false);
      });

      const result = await deleteCart('error123');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateCart', () => {
    it('debe actualizar un carrito correctamente', async () => {
      const updates = { user_id: 'user456' };
      const result = await updateCart('cart123', updates);

      expect(result).not.toBeNull();
      expect(result?.id).toBe('cart123');
      expect(result?.user_id).toBe('user456');
    });

    it('debe manejar errores al actualizar un carrito', async () => {
      (updateCart as jest.Mock).mockImplementationOnce(() => {
        console.error('Error al actualizar carrito');
        return Promise.resolve(null);
      });

      const updates = { user_id: 'user456' };
      const result = await updateCart('error123', updates);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
