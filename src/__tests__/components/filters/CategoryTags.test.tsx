import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CategoryTags from '@/components/filters/CategoryTags';
import { setSelectedCategory } from '@/store/products/slices/productsSlice';

const mockStore = configureStore([]);

describe('CategoryTags', () => {
  let store: any;
  const initialState = {
    products: {
      categories: [
        { id: 'cat1', name: 'Plantas' },
        { id: 'cat2', name: 'Macetas' },
        { id: 'cat3', name: 'Accesorios' },
      ],
      selectedCategory: null,
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  test('debe renderizar todas las categorías proporcionadas', () => {
    render(
      <Provider store={store}>
        <CategoryTags />
      </Provider>
    );

    expect(screen.getByText('Plantas')).toBeInTheDocument();
    expect(screen.getByText('Macetas')).toBeInTheDocument();
    expect(screen.getByText('Accesorios')).toBeInTheDocument();
  });

  test('debe asignar la clase correcta a la categoría seleccionada', () => {
    const storeWithSelectedCategory = mockStore({
      products: {
        ...initialState.products,
        selectedCategory: 'cat2',
      },
    });

    render(
      <Provider store={storeWithSelectedCategory}>
        <CategoryTags />
      </Provider>
    );

    const plantasButton = screen.getByText('Plantas');
    const macetasButton = screen.getByText('Macetas');
    const accesoriosButton = screen.getByText('Accesorios');

    expect(plantasButton).toHaveClass('bg-gray-100');
    expect(macetasButton).toHaveClass('bg-emerald-600', 'text-white');
    expect(accesoriosButton).toHaveClass('bg-gray-100');
  });

  test('debe despachar setSelectedCategory al hacer clic en una categoría', () => {
    render(
      <Provider store={store}>
        <CategoryTags />
      </Provider>
    );

    fireEvent.click(screen.getByText('Plantas'));

    expect(store.dispatch).toHaveBeenCalledWith(setSelectedCategory('cat1'));
  });

  test('debe despachar setSelectedCategory con null al hacer clic en la categoría ya seleccionada', () => {
    const storeWithSelectedCategory = mockStore({
      products: {
        ...initialState.products,
        selectedCategory: 'cat2',
      },
    });
    storeWithSelectedCategory.dispatch = jest.fn();

    render(
      <Provider store={storeWithSelectedCategory}>
        <CategoryTags />
      </Provider>
    );

    fireEvent.click(screen.getByText('Macetas'));

    expect(storeWithSelectedCategory.dispatch).toHaveBeenCalledWith(setSelectedCategory(null));
  });

  test('no debe renderizar nada si no hay categorías', () => {
    const storeWithoutCategories = mockStore({
      products: {
        ...initialState.products,
        categories: [],
      },
    });

    const { container } = render(
      <Provider store={storeWithoutCategories}>
        <CategoryTags />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
