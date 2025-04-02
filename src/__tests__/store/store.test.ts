import { resetAuthState } from '@/store/auth/slices/authSlice';
import { store, RootState } from '@/store/store';

describe('Redux Store', () => {
  test('debe tener todos los reducers configurados correctamente', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('products');
    expect(state).toHaveProperty('cart');
    expect(state).toHaveProperty('favorites');
  });

  test('el store debe incluir todos los reducers esperados', () => {
    const state: RootState = store.getState();

    expect(state.auth).toBeDefined();
    expect(state.products).toBeDefined();
    expect(state.cart).toBeDefined();
    expect(state.favorites).toBeDefined();
  });

  test('el store debe ser configurable con middleware personalizado', () => {
    expect(store.dispatch).toBeInstanceOf(Function);

    expect(() => {
      store.dispatch({ type: 'TEST_ACTION' });
    }).not.toThrow();
  });

  test('store debe permitir despachar acciones de autenticación', () => {
    store.dispatch(resetAuthState());

    const state = store.getState();
    expect(state.auth.error).toBeNull();
    expect(state.auth.success).toBe(false);
  });
});
