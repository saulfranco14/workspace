import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '@/components/shared/loading/Spinner';

describe('LoadingSpinner', () => {
  test('debe renderizar el spinner con el mensaje de carga', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Cargando, por favor espera...')).toBeInTheDocument();
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-16', 'w-16', 'border-t-4', 'border-b-4', 'border-emerald-600');
  });

  test('debe tener la clase animate-pulse en el texto de carga', () => {
    render(<LoadingSpinner />);
    const loadingText = screen.getByText('Cargando, por favor espera...');
    expect(loadingText).toHaveClass('animate-pulse', 'text-gray-600');
  });

  test('debe estar centrado en el contenedor', () => {
    render(<LoadingSpinner />);
    const container = document.querySelector('.flex');
    expect(container).toHaveClass('flex', 'flex-col', 'justify-center', 'items-center');
  });
});
