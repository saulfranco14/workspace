import { fetchCart, addToCart, updateItemQuantity, removeFromCart, emptyCart } from '@/store/cart/thunk/cartThunk';
import * as cartService from '@/services/cart/cartService';
import * as cartItemsService from '@/services/cart/cartItemsService';
import { Cart, CartItem } from '@/interfaces/cart.interface';

jest.mock('@/services/cart/cartService');
jest.mock('@/services/cart/cartItemsService');

describe('CartThunks', () => {
  const mockCart: Cart = {
    id: 'cart123',
    user_id: 'user123',
    device_fingerprint: null,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
  };

  const mockCartItems: CartItem[] = [
    {
      id: 'item1',
      cart_id: 'cart123',
      product_id: 'prod1',
      quantity: 2,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      product: {
        id: 'prod1',
        name: 'Producto 1',
        price: 10.99,
        image_url: 'imagen1.jpg',
        stock: 10,
      },
    },
  ];

  const mockCartWithItems = {
    cart: mockCart,
    items: mockCartItems,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCart', () => {
    test('debe obtener un carrito con elementos exitosamente', async () => {
      (cartService.getOrCreateCart as jest.Mock).mockResolvedValue(mockCart);
      (cartService.getCartWithItems as jest.Mock).mockResolvedValue(mockCartWithItems);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchCart('user123')(dispatch, getState, undefined);

      expect(cartService.getOrCreateCart).toHaveBeenCalledWith('user123');
      expect(cartService.getCartWithItems).toHaveBeenCalledWith(mockCart.id);
      expect(result.payload).toEqual(mockCartWithItems);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar el error cuando no se puede obtener el carrito', async () => {
      (cartService.getOrCreateCart as jest.Mock).mockResolvedValue(null);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchCart('user123')(dispatch, getState, undefined);

      expect(cartService.getOrCreateCart).toHaveBeenCalledWith('user123');
      expect(cartService.getCartWithItems).not.toHaveBeenCalled();
      expect(result.payload).toBeNull();
      expect(result.meta.requestStatus).toBe('fulfilled');
    });
  });

  describe('addToCart', () => {
    const mockState = {
      cart: {
        cart: mockCart,
        items: mockCartItems,
        loading: false,
        error: null,
        isOpen: false,
      },
    };

    const mockAddToCartPayload = {
      productId: 'prod2',
      quantity: 1,
    };

    const mockNewCartItem: CartItem = {
      id: 'item2',
      cart_id: 'cart123',
      product_id: 'prod2',
      quantity: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      product: {
        id: 'prod2',
        name: 'Producto 2',
        price: 20.99,
        image_url: 'imagen2.jpg',
        stock: 5,
      },
    };

    test('debe añadir un producto al carrito con éxito', async () => {
      (cartService.addItemToCart as jest.Mock).mockResolvedValue(mockNewCartItem);

      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue(mockState);
      const result = await addToCart(mockAddToCartPayload)(dispatch, getState, undefined);

      expect(cartService.addItemToCart).toHaveBeenCalledWith(
        mockCart.id,
        mockAddToCartPayload.productId,
        mockAddToCartPayload.quantity
      );
      expect(result.payload).toEqual(mockNewCartItem);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe rechazar cuando no hay carrito activo', async () => {
      const stateWithoutCart = {
        cart: {
          ...mockState.cart,
          cart: null,
        },
      };

      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue(stateWithoutCart);
      const result = await addToCart(mockAddToCartPayload)(dispatch, getState, undefined);

      expect(cartService.addItemToCart).not.toHaveBeenCalled();
      expect(result.payload).toBe('No hay un carrito activo');
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar errores al añadir al carrito', async () => {
      (cartService.addItemToCart as jest.Mock).mockResolvedValue(null);

      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue(mockState);
      const result = await addToCart(mockAddToCartPayload)(dispatch, getState, undefined);

      expect(cartService.addItemToCart).toHaveBeenCalled();
      expect(result.payload).toBe('No se pudo añadir el producto al carrito');
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('updateItemQuantity', () => {
    const mockUpdatePayload = {
      itemId: 'item1',
      quantity: 5,
    };

    const mockUpdatedItem: CartItem = {
      ...mockCartItems[0],
      quantity: 5,
    };

    test('debe actualizar la cantidad de un elemento con éxito', async () => {
      (cartService.updateCartItemQuantity as jest.Mock).mockResolvedValue(true);
      (cartItemsService.getCartItemById as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await updateItemQuantity(mockUpdatePayload)(dispatch, getState, undefined);

      expect(cartService.updateCartItemQuantity).toHaveBeenCalledWith(
        mockUpdatePayload.itemId,
        mockUpdatePayload.quantity
      );
      expect(cartItemsService.getCartItemById).toHaveBeenCalledWith(mockUpdatePayload.itemId);
      expect(result.payload).toEqual(mockUpdatedItem);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe rechazar cuando falla la actualización', async () => {
      (cartService.updateCartItemQuantity as jest.Mock).mockResolvedValue(false);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await updateItemQuantity(mockUpdatePayload)(dispatch, getState, undefined);

      expect(result.meta.requestStatus).toBe('rejected');
      expect((result as any).error?.message).toBe('No se pudo actualizar la cantidad');
    });

    test('debe rechazar cuando no se puede obtener el elemento actualizado', async () => {
      (cartService.updateCartItemQuantity as jest.Mock).mockResolvedValue(true);
      (cartItemsService.getCartItemById as jest.Mock).mockResolvedValue(null);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await updateItemQuantity(mockUpdatePayload)(dispatch, getState, undefined);

      expect(result.meta.requestStatus).toBe('rejected');
      expect((result as any).error?.message).toBe('No se pudo obtener el item actualizado');
    });
  });

  describe('removeFromCart', () => {
    test('debe eliminar un elemento del carrito con éxito', async () => {
      (cartService.removeCartItem as jest.Mock).mockResolvedValue(true);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await removeFromCart('item1')(dispatch, getState, undefined);

      expect(cartService.removeCartItem).toHaveBeenCalledWith('item1');
      expect(result.payload).toBe('item1');
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe rechazar cuando falla la eliminación', async () => {
      (cartService.removeCartItem as jest.Mock).mockResolvedValue(false);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await removeFromCart('item1')(dispatch, getState, undefined);

      expect(result.meta.requestStatus).toBe('rejected');
      expect((result as any).error?.message).toBe('No se pudo eliminar el producto del carrito');
    });
  });

  describe('emptyCart', () => {
    const mockState = {
      cart: {
        cart: mockCart,
        items: mockCartItems,
        loading: false,
        error: null,
        isOpen: false,
      },
    };

    test('debe vaciar el carrito con éxito', async () => {
      (cartService.clearCart as jest.Mock).mockResolvedValue(true);

      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue(mockState);
      const result = await emptyCart()(dispatch, getState, undefined);

      expect(cartService.clearCart).toHaveBeenCalledWith(mockCart.id);
      expect(result.payload).toBe(true);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe rechazar cuando no hay carrito activo', async () => {
      const stateWithoutCart = {
        cart: {
          ...mockState.cart,
          cart: null,
        },
      };

      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue(stateWithoutCart);
      const result = await emptyCart()(dispatch, getState, undefined);

      expect(result.meta.requestStatus).toBe('rejected');
      expect((result as any).error?.message).toBe('No hay un carrito activo');
    });

    test('debe rechazar cuando falla el vaciado', async () => {
      (cartService.clearCart as jest.Mock).mockResolvedValue(false);

      const dispatch = jest.fn();
      const getState = jest.fn().mockReturnValue(mockState);
      const result = await emptyCart()(dispatch, getState, undefined);

      expect(result.meta.requestStatus).toBe('rejected');
      expect((result as any).error?.message).toBe('No se pudo vaciar el carrito');
    });
  });
});
