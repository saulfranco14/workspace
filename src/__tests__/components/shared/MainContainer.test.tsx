import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainContainer from '@/components/shared/MainContainer';

// Mock del hook useClientReady
jest.mock('@/hooks/useClientReady', () => ({
  useClientReady: jest.fn(),
}));

// Mock del estilo PageContainer
jest.mock('@/styles', () => ({
  PageContainer: ({ children, className }: { children: React.ReactNode; className: string }) => (
    <div data-testid="page-container" className={className}>
      {children}
    </div>
  ),
}));

describe('MainContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar los children dentro del contenedor', () => {
    // Configurar mock para simular que el cliente está listo
    require('@/hooks/useClientReady').useClientReady.mockReturnValue(true);

    render(
      <MainContainer>
        <p>Contenido de prueba</p>
      </MainContainer>
    );

    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  test('debe tener la clase de opacidad 0 cuando el cliente no está listo', () => {
    // Configurar mock para simular que el cliente no está listo
    require('@/hooks/useClientReady').useClientReady.mockReturnValue(false);

    render(
      <MainContainer>
        <p>Contenido de prueba</p>
      </MainContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass('opacity-0');
    expect(container).not.toHaveClass('opacity-100');
  });

  test('debe tener la clase de opacidad 100 cuando el cliente está listo', () => {
    // Configurar mock para simular que el cliente está listo
    require('@/hooks/useClientReady').useClientReady.mockReturnValue(true);

    render(
      <MainContainer>
        <p>Contenido de prueba</p>
      </MainContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass('opacity-100');
    expect(container).not.toHaveClass('opacity-0');
  });

  test('debe respetar la prop isClient cuando se proporciona (true)', () => {
    // Configurar mock para simular que el cliente no está listo
    require('@/hooks/useClientReady').useClientReady.mockReturnValue(false);

    render(
      <MainContainer isClient={true}>
        <p>Contenido de prueba</p>
      </MainContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass('opacity-100');
    expect(container).not.toHaveClass('opacity-0');
  });

  test('debe respetar la prop isClient cuando se proporciona (false)', () => {
    // Configurar mock para simular que el cliente está listo
    require('@/hooks/useClientReady').useClientReady.mockReturnValue(true);

    render(
      <MainContainer isClient={false}>
        <p>Contenido de prueba</p>
      </MainContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass('opacity-0');
    expect(container).not.toHaveClass('opacity-100');
  });

  test('debe tener clases de transición adecuadas', () => {
    // Configurar mock para simular que el cliente está listo
    require('@/hooks/useClientReady').useClientReady.mockReturnValue(true);

    render(
      <MainContainer>
        <p>Contenido de prueba</p>
      </MainContainer>
    );

    const container = screen.getByTestId('page-container');
    expect(container).toHaveClass('transition-opacity');
    expect(container).toHaveClass('duration-500');
    expect(container).toHaveClass('ease-in');
  });
});
