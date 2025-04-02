import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyResults from '@/components/shared/EmptyResults';

describe('EmptyResults', () => {
  test('debe renderizar con el título proporcionado', () => {
    render(<EmptyResults title="No hay resultados" />);
    expect(screen.getByText('No hay resultados')).toBeInTheDocument();
  });

  test('debe mostrar el mensaje por defecto cuando no se proporciona ninguno', () => {
    render(<EmptyResults title="No hay resultados" />);
    expect(screen.getByText('No se encontraron productos en esta categoría.')).toBeInTheDocument();
  });

  test('debe mostrar un mensaje personalizado cuando se proporciona', () => {
    const customMessage = 'Mensaje personalizado de resultados vacíos';
    render(<EmptyResults title="No hay resultados" message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('debe renderizar el icono por defecto cuando no se proporciona ninguno', () => {
    render(<EmptyResults title="No hay resultados" />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-gray-400');
  });

  test('debe renderizar un icono personalizado cuando se proporciona', () => {
    const customIcon = <div data-testid="custom-icon">Icono personalizado</div>;
    render(<EmptyResults title="No hay resultados" icon={customIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    const svg = document.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  test('debe tener las clases de estilo correctas', () => {
    render(<EmptyResults title="No hay resultados" />);
    const container = screen.getByText('No hay resultados').closest('div');
    expect(container).toHaveClass('border border-gray-200 bg-gray-50 rounded-lg');
    const iconContainer = document.querySelector('.mx-auto.w-16.h-16');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('bg-gray-100');
    const title = screen.getByText('No hay resultados');
    expect(title).toHaveClass('text-xl font-medium text-gray-800');
    const message = screen.getByText('No se encontraron productos en esta categoría.');
    expect(message).toHaveClass('text-gray-600');
  });
});
