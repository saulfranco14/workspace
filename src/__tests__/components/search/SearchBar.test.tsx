import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SearchBar from '@/components/search/SearchBar';
import * as productThunk from '@/store/products/thunk/productThunk';
import { setSelectedCategory, clearFilters } from '@/store/products/slices/productsSlice';

jest.mock('@/store/products/thunk/productThunk', () => ({
  searchProductsThunk: jest.fn().mockImplementation((term) => ({ type: 'mocked-search-action', payload: term })),
}));

const mockStore = configureStore([]);

describe('SearchBar', () => {
  let store: any;
  const mockSearchProductsThunk = productThunk.searchProductsThunk as jest.MockedFunction<
    typeof productThunk.searchProductsThunk
  >;

  beforeEach(() => {
    const initialState = {
      products: {
        categories: [
          { id: 'cat1', name: 'Plantas', type: 'plant' },
          { id: 'cat2', name: 'Macetas', type: 'accessory' },
          { id: 'cat3', name: 'Kits', type: 'kit' },
        ],
        selectedCategory: null,
        loading: false,
        searchTerm: '',
      },
    };

    store = mockStore(initialState);
    store.dispatch = jest.fn();

    jest.clearAllMocks();
  });

  test('debe renderizar el campo de búsqueda y el botón de categorías', () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Buscar plantas, accesorios o kits...');
    expect(searchInput).toBeInTheDocument();

    const categoryButton = screen.getByText('Categorías');
    expect(categoryButton).toBeInTheDocument();
  });

  test('debe mostrar el término de búsqueda desde el store', () => {
    const storeWithSearch = mockStore({
      products: {
        categories: [],
        selectedCategory: null,
        loading: false,
        searchTerm: 'monstera',
      },
    });

    render(
      <Provider store={storeWithSearch}>
        <SearchBar />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Buscar plantas, accesorios o kits...');
    expect(searchInput).toHaveValue('monstera');
  });

  test('debe despachar searchProductsThunk cuando se envía el formulario', () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Buscar plantas, accesorios o kits...');
    fireEvent.change(searchInput, { target: { value: 'monstera' } });

    const form = searchInput.closest('form');
    fireEvent.submit(form!);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(mockSearchProductsThunk).toHaveBeenCalledWith('monstera');
  });

  test('no debe despachar searchProductsThunk cuando el término de búsqueda está vacío', () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const form = screen.getByPlaceholderText('Buscar plantas, accesorios o kits...').closest('form');
    fireEvent.submit(form!);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('debe mostrar el nombre de la categoría seleccionada', () => {
    const storeWithCategory = mockStore({
      products: {
        categories: [
          { id: 'cat1', name: 'Plantas', type: 'plant' },
          { id: 'cat2', name: 'Macetas', type: 'accessory' },
        ],
        selectedCategory: 'cat1',
        loading: false,
        searchTerm: '',
      },
    });

    render(
      <Provider store={storeWithCategory}>
        <SearchBar />
      </Provider>
    );

    const categoryButton = screen.getByText('Plantas');
    expect(categoryButton).toBeInTheDocument();
  });

  test('debe mostrar y ocultar el dropdown de categorías al hacer click en el botón', () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    expect(screen.queryByText('Todas las categorías')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Categorías'));

    expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
    expect(screen.getByText('Plantas')).toBeInTheDocument();
    expect(screen.getByText('Macetas')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Categorías'));

    expect(screen.queryByText('Todas las categorías')).not.toBeInTheDocument();
  });

  test('debe despachar setSelectedCategory al seleccionar una categoría', () => {
    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    fireEvent.click(screen.getByText('Categorías'));

    fireEvent.click(screen.getByText('Plantas'));

    expect(store.dispatch).toHaveBeenCalledWith(setSelectedCategory('cat1'));
  });

  test('debe despachar clearFilters al hacer click en el botón de limpiar', () => {
    const storeWithSearch = mockStore({
      products: {
        categories: [],
        selectedCategory: null,
        loading: false,
        searchTerm: 'monstera',
      },
    });
    storeWithSearch.dispatch = jest.fn();

    render(
      <Provider store={storeWithSearch}>
        <SearchBar />
      </Provider>
    );

    const clearButton = screen.getByLabelText('Limpiar búsqueda');
    fireEvent.click(clearButton);

    expect(storeWithSearch.dispatch).toHaveBeenCalled();
  });

  test('debe mostrar un indicador de carga cuando loading es true', () => {
    const loadingStore = mockStore({
      products: {
        categories: [],
        selectedCategory: null,
        loading: true,
        searchTerm: '',
      },
    });

    render(
      <Provider store={loadingStore}>
        <SearchBar />
      </Provider>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
