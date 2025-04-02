import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/interfaces/product.interface';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} data-testid="product-image" />;
  },
}));

jest.mock('next/link', () => {
  return function MockedLink({ children, href }: { children: React.ReactNode; href: string }) {
    return (
      <a href={href} data-testid={`link-to-${href}`}>
        {children}
      </a>
    );
  };
});

jest.mock('@/components/cart/AddToCartButton', () => {
  return function MockAddToCartButton({ productId, stock }: { productId: string; stock: number }) {
    return <button data-testid={`add-to-cart-${productId}`}>Agregar al carrito (Stock: {stock})</button>;
  };
});

jest.mock('@/components/favorites/AddToFavoritesButton', () => {
  return function MockAddToFavoritesButton({ productId, size }: { productId: string; size: string }) {
    return (
      <button data-testid={`add-to-favorites-${productId}`} data-size={size}>
        Añadir a favoritos
      </button>
    );
  };
});

jest.mock('@/components/cart/ViewMoreButton', () => {
  return function MockViewMoreButton({ productId }: { productId: string }) {
    return <button data-testid={`view-more-${productId}`}>Ver más</button>;
  };
});

const mockStore = configureStore([]);
const initialState = {
  favorites: {
    collections: [],
    activeCollection: null,
  },
};

describe('ProductCard', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  const mockProduct: Product = {
    id: 'prod1',
    name: 'Planta Monstera',
    description: 'Una hermosa planta de interior',
    price: 29.99,
    stock: 15,
    image_url: '/images/monstera.jpg',
    category_id: 'cat1',
    category: {
      id: 'cat1',
      name: 'Plantas',
      type: 'plant',
    },
    is_featured: false,
  };

  test('debe renderizar el nombre del producto correctamente', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText('Planta Monstera')).toBeInTheDocument();
  });

  test('debe renderizar la imagen del producto cuando está disponible', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const image = screen.getByTestId('product-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/monstera.jpg');
    expect(image).toHaveAttribute('alt', 'Planta Monstera');
  });

  test('debe renderizar una imagen de marcador de posición cuando no hay imagen', () => {
    const productWithoutImage = { ...mockProduct, image_url: undefined };

    render(
      <Provider store={store}>
        <ProductCard product={productWithoutImage} />
      </Provider>
    );

    const svgPlaceholder = document.querySelector('svg');
    expect(svgPlaceholder).toBeInTheDocument();
  });

  test('debe mostrar la categoría del producto si está disponible', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText('Plantas')).toBeInTheDocument();
  });

  test('debe mostrar el precio del producto formateado correctamente', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  test('debe mostrar "Disponible" cuando hay suficiente stock', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });

  test('debe mostrar "Pocas unidades" cuando el stock es bajo', () => {
    const productWithLowStock = { ...mockProduct, stock: 5 };

    render(
      <Provider store={store}>
        <ProductCard product={productWithLowStock} />
      </Provider>
    );

    expect(screen.getByText('Pocas unidades')).toBeInTheDocument();
  });

  test('debe mostrar "Agotado" cuando no hay stock', () => {
    const productWithNoStock = { ...mockProduct, stock: 0 };

    render(
      <Provider store={store}>
        <ProductCard product={productWithNoStock} />
      </Provider>
    );

    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });

  test('debe renderizar los botones de acción correctamente', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    expect(screen.getByTestId(`add-to-favorites-${mockProduct.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`view-more-${mockProduct.id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`add-to-cart-${mockProduct.id}`)).toBeInTheDocument();
  });

  test('debe tener un enlace a la página detallada del producto', () => {
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
      </Provider>
    );

    const link = screen.getByTestId(`link-to-/productos/${mockProduct.id}`);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/productos/${mockProduct.id}`);
  });
});
