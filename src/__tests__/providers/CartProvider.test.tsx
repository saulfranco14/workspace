import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CartProvider } from '@/providers/CartProvider';
import { fetchCart } from '@/store/cart/thunk/cartThunk';
import { fetchUserFavoriteCollections } from '@/store/favorites/thunk/favoritesThunk';
import { useSession } from '@/hooks/useSession';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@/store/cart/thunk/cartThunk', () => ({
  fetchCart: jest.fn(),
}));

jest.mock('@/store/favorites/thunk/favoritesThunk', () => ({
  fetchUserFavoriteCollections: jest.fn(),
}));

jest.mock('@/hooks/useSession', () => ({
  useSession: jest.fn(),
}));

describe('CartProvider', () => {
  const mockDispatch = jest.fn((action) => action);

  beforeEach(() => {
    (jest.requireMock('react-redux').useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSession as jest.Mock).mockReturnValue({
      session: {
        user: { id: 'user123' },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe llamar a fetchCart con el ID del usuario cuando hay una sesión', () => {
    render(<CartProvider>Componente hijo</CartProvider>);
    expect(fetchCart).toHaveBeenCalledWith('user123');
    expect(mockDispatch).toHaveBeenCalledWith(fetchCart('user123'));
  });

  test('debe llamar a fetchCart con undefined cuando no hay usuario', () => {
    (useSession as jest.Mock).mockReturnValue({
      session: null,
    });

    render(<CartProvider>Componente hijo</CartProvider>);
    expect(fetchCart).toHaveBeenCalledWith(undefined);
    expect(mockDispatch).toHaveBeenCalledWith(fetchCart(undefined));
  });

  test('debe llamar a fetchUserFavoriteCollections', () => {
    render(<CartProvider>Componente hijo</CartProvider>);
    expect(fetchUserFavoriteCollections).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(fetchUserFavoriteCollections());
  });

  test('debe renderizar los componentes hijos', () => {
    const { getByText } = render(
      <CartProvider>
        <div>Componente hijo</div>
      </CartProvider>
    );

    expect(getByText('Componente hijo')).toBeInTheDocument();
  });
});
