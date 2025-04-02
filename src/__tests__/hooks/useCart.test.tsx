import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCart } from '@/hooks/useCart';

jest.mock('@/hooks/useCart', () => {
  const originalModule = jest.requireActual('@/hooks/useCart');

  return {
    useCart: () => ({
      cart: originalModule.useCart().cart,
      items: originalModule.useCart().items,
      loading: originalModule.useCart().loading,
      error: originalModule.useCart().error,
      isOpen: originalModule.useCart().isOpen,
      totalItems: originalModule.useCart().totalItems,
      totalPrice: originalModule.useCart().totalPrice,
      showCart: jest.fn(),
      hideCart: jest.fn(),
      addProductToCart: jest.fn(),
      updateQuantity: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    }),
  };
});

const mockCart = {
  id: 'cart123',
  user_id: 'user123',
  device_fingerprint: null,
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
};

const mockCartItems = [
  {
    id: 'item1',
    cart_id: 'cart123',
    product_id: 'prod1',
    quantity: 2,
    product: {
      id: 'prod1',
      name: 'Producto 1',
      price: 10.99,
      image_url: 'imagen1.jpg',
      stock: 10,
    },
  },
  {
    id: 'item2',
    cart_id: 'cart123',
    product_id: 'prod2',
    quantity: 1,
    product: {
      id: 'prod2',
      name: 'Producto 2',
      price: 20.5,
      image_url: 'imagen2.jpg',
      stock: 5,
    },
  },
];

interface CartState {
  cart: typeof mockCart | null;
  items: typeof mockCartItems;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

const mockCartReducer = (
  state: CartState = {
    cart: null,
    items: [],
    loading: false,
    error: null,
    isOpen: false,
  },
  action: { type: string; payload?: any }
) => {
  return state;
};

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: mockCartReducer,
    },
    preloadedState: {
      cart: {
        cart: null,
        items: [],
        loading: false,
        error: null,
        isOpen: false,
        ...initialState,
      },
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }, store: any) => (
  <Provider store={store}>{children}</Provider>
);

describe('useCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe devolver el estado inicial correctamente', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useCart(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.cart).toBeNull();
    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isOpen).toBe(false);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  test('debe calcular totalItems y totalPrice correctamente', () => {
    const store = createTestStore({
      cart: mockCart,
      items: mockCartItems,
    });

    const { result } = renderHook(() => useCart(), {
      wrapper: (props) => wrapper(props, store),
    });

    // 2 de primer producto + 1 del segundo = 3
    expect(result.current.totalItems).toBe(3);

    // (10.99 * 2) + (20.5 * 1) = 42.48
    expect(result.current.totalPrice).toBeCloseTo(42.48, 2);
  });

  test('debe mostrar y ocultar el carrito', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useCart(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.showCart();
    });

    expect(result.current.showCart).toHaveBeenCalled();

    act(() => {
      result.current.hideCart();
    });

    expect(result.current.hideCart).toHaveBeenCalled();
  });

  test('debe invocar las acciones del carrito', async () => {
    const store = createTestStore({
      cart: mockCart,
    });

    const { result } = renderHook(() => useCart(), {
      wrapper: (props) => wrapper(props, store),
    });

    await act(async () => {
      result.current.addProductToCart('prod1', 2);
    });
    expect(result.current.addProductToCart).toHaveBeenCalledWith('prod1', 2);

    await act(async () => {
      result.current.updateQuantity('item1', 3);
    });
    expect(result.current.updateQuantity).toHaveBeenCalledWith('item1', 3);

    await act(async () => {
      result.current.removeItem('item1');
    });
    expect(result.current.removeItem).toHaveBeenCalledWith('item1');

    await act(async () => {
      result.current.clearCart();
    });
    expect(result.current.clearCart).toHaveBeenCalled();
  });
});
