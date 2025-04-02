import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Banner from '@/components/home/Banner';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
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

describe('Banner', () => {
  test('debe renderizar el título correctamente', () => {
    render(<Banner />);
    expect(screen.getByText('Iluminando tu espacio')).toBeInTheDocument();
  });

  test('debe renderizar la descripción correctamente', () => {
    render(<Banner />);
    expect(
      screen.getByText(
        'Descubre nuestra colección de plantas y accesorios para transformar tu espacio y conectar con la naturaleza.'
      )
    ).toBeInTheDocument();
  });

  test('debe contener un enlace a la página de productos', () => {
    render(<Banner />);
    const link = screen.getByTestId('link-to-/productos');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/productos');
    expect(link.textContent).toContain('Ver nuevos productos');
  });

  test('debe mostrar la imagen del banner', () => {
    render(<Banner />);
    const image = document.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/homepage/banner_1.jpg');
    expect(image).toHaveAttribute('alt', 'Plantas decorativas');
  });

  test('debe tener las clases responsive correctas', () => {
    render(<Banner />);
    const container = document.querySelector('.relative.w-full');
    expect(container).toHaveClass('h-[300px]', 'md:h-[400px]');
    const title = screen.getByText('Iluminando tu espacio');
    expect(title).toHaveClass('text-2xl', 'md:text-4xl');
    const description = screen.getByText(
      'Descubre nuestra colección de plantas y accesorios para transformar tu espacio y conectar con la naturaleza.'
    );
    expect(description).toHaveClass('text-sm', 'md:text-base');
    const overlay = document.querySelector('.absolute.inset-0.bg-gradient-to-r');
    expect(overlay).toHaveClass('md:hidden');
  });
});
