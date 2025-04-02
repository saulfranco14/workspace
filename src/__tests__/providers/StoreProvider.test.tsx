import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoreProvider from '@/providers/StoreProvider';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

jest.mock('react-redux', () => ({
  Provider: jest.fn(({ children }) => <div data-testid="redux-provider">{children}</div>),
}));

jest.mock('@/store/store', () => ({
  store: {},
}));

describe('StoreProvider', () => {
  test('debe renderizar el Provider de Redux con el store correcto', () => {
    render(
      <StoreProvider>
        <div data-testid="child-component">Componente hijo</div>
      </StoreProvider>
    );

    expect(Provider).toHaveBeenCalledWith(
      expect.objectContaining({
        store,
        children: expect.anything(),
      }),
      expect.anything()
    );
  });

  test('debe renderizar los hijos correctamente', () => {
    const { getByTestId } = render(
      <StoreProvider>
        <div data-testid="child-component">Componente hijo</div>
      </StoreProvider>
    );

    expect(getByTestId('child-component')).toBeInTheDocument();
    expect(getByTestId('child-component').textContent).toBe('Componente hijo');
  });
});
