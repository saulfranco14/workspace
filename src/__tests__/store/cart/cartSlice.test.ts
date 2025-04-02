import cartReducer, { openCart, closeCart, clearError } from '@/store/cart/slices/cartSlice';
import { initialState } from '@/store/cart/initialState';
import { fetchCart, addToCart, updateItemQuantity, removeFromCart, emptyCart } from '@/store/cart/thunk/cartThunk';
import { Cart, CartItem } from '@/interfaces/cart.interface';

describe('CartSlice reducers', () => {
  test('debe devolver el estado inicial', () => {
    expect(cartReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('openCart debe abrir el carrito', () => {
    const previousState = {
      ...initialState,
      isOpen: false,
    };

    expect(cartReducer(previousState, openCart())).toEqual({
      ...previousState,
      isOpen: true,
    });
  });

  test('closeCart debe cerrar el carrito', () => {
    const previousState = {
      ...initialState,
      isOpen: true,
    };

    expect(cartReducer(previousState, closeCart())).toEqual({
      ...previousState,
      isOpen: false,
    });
  });

  test('clearError debe limpiar los errores', () => {
    const previousState = {
      ...initialState,
      error: 'Error previo',
    };

    expect(cartReducer(previousState, clearError())).toEqual({
      ...previousState,
      error: null,
    });
  });
});

describe('CartSlice extraReducers', () => {
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

  describe('fetchCart', () => {
    test('fetchCart.pending debe establecer loading y resetear errores', () => {
      const action = { type: fetchCart.pending.type };
      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('fetchCart.fulfilled debe actualizar el carrito y los elementos', () => {
      const action = {
        type: fetchCart.fulfilled.type,
        payload: {
          cart: mockCart,
          items: mockCartItems,
        },
      };

      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        cart: mockCart,
        items: mockCartItems,
      });
    });

    test('fetchCart.rejected debe manejar errores', () => {
      const action = {
        type: fetchCart.rejected.type,
        error: { message: 'Error al obtener carrito' },
      };

      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al obtener carrito',
      });
    });
  });

  describe('addToCart', () => {
    test('addToCart.pending debe establecer loading y resetear errores', () => {
      const action = { type: addToCart.pending.type };
      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('addToCart.fulfilled debe añadir un nuevo elemento al carrito', () => {
      const stateWithItems = {
        ...initialState,
        items: [...mockCartItems],
      };

      const newItem: CartItem = {
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

      const action = {
        type: addToCart.fulfilled.type,
        payload: newItem,
      };

      const state = cartReducer(stateWithItems, action);

      expect(state.items).toHaveLength(2);
      expect(state.items).toContainEqual(newItem);
    });

    test('addToCart.fulfilled debe actualizar un elemento existente', () => {
      const stateWithItems = {
        ...initialState,
        items: [...mockCartItems],
      };

      const updatedItem: CartItem = {
        ...mockCartItems[0],
        quantity: 3,
      };

      const action = {
        type: addToCart.fulfilled.type,
        payload: updatedItem,
      };

      const state = cartReducer(stateWithItems, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(updatedItem);
    });

    test('addToCart.rejected debe manejar errores', () => {
      const action = {
        type: addToCart.rejected.type,
        error: { message: 'Error al añadir al carrito' },
      };

      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al añadir al carrito',
      });
    });
  });

  describe('updateItemQuantity', () => {
    test('updateItemQuantity.pending debe establecer loading y resetear errores', () => {
      const action = { type: updateItemQuantity.pending.type };
      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('updateItemQuantity.fulfilled debe actualizar la cantidad de un elemento', () => {
      const stateWithItems = {
        ...initialState,
        items: [...mockCartItems],
      };

      const updatedItem: CartItem = {
        ...mockCartItems[0],
        quantity: 5,
      };

      const action = {
        type: updateItemQuantity.fulfilled.type,
        payload: updatedItem,
      };

      const state = cartReducer(stateWithItems, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    test('updateItemQuantity.rejected debe manejar errores', () => {
      const action = {
        type: updateItemQuantity.rejected.type,
        error: { message: 'Error al actualizar cantidad' },
      };

      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al actualizar cantidad',
      });
    });
  });

  describe('removeFromCart', () => {
    test('removeFromCart.pending debe establecer loading y resetear errores', () => {
      const action = { type: removeFromCart.pending.type };
      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('removeFromCart.fulfilled debe eliminar un elemento del carrito', () => {
      const stateWithItems = {
        ...initialState,
        items: [...mockCartItems],
      };

      const action = {
        type: removeFromCart.fulfilled.type,
        payload: 'item1',
      };

      const state = cartReducer(stateWithItems, action);

      expect(state.items).toHaveLength(0);
    });

    test('removeFromCart.rejected debe manejar errores', () => {
      const action = {
        type: removeFromCart.rejected.type,
        error: { message: 'Error al eliminar del carrito' },
      };

      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al eliminar del carrito',
      });
    });
  });

  describe('emptyCart', () => {
    test('emptyCart.pending debe establecer loading y resetear errores', () => {
      const action = { type: emptyCart.pending.type };
      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('emptyCart.fulfilled debe vaciar los elementos del carrito', () => {
      const stateWithItems = {
        ...initialState,
        items: [...mockCartItems],
      };

      const action = {
        type: emptyCart.fulfilled.type,
      };

      const state = cartReducer(stateWithItems, action);

      expect(state.items).toHaveLength(0);
    });

    test('emptyCart.rejected debe manejar errores', () => {
      const action = {
        type: emptyCart.rejected.type,
        error: { message: 'Error al vaciar el carrito' },
      };

      const state = cartReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al vaciar el carrito',
      });
    });
  });
});
