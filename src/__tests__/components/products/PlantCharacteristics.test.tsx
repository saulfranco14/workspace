import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantCharacteristics from '@/components/products/PlantCharacteristics';
import { characteristics } from '@/helpers/PlanCharacteristics';

jest.mock('@/helpers/PlanCharacteristics', () => ({
  characteristics: [
    {
      title: 'Purificadoras de aire',
      description: 'Las plantas filtran toxinas y mejoran la calidad del aire en tu hogar.',
      icon: <svg data-testid="icon-purificadoras" className="text-emerald-600" />,
    },
    {
      title: 'Bienestar emocional',
      description: 'Cuidar plantas reduce el estrés y mejora tu estado de ánimo.',
      icon: <svg data-testid="icon-bienestar" className="text-emerald-600" />,
    },
    {
      title: 'Decoración natural',
      description: 'Añaden vida, color y textura a cualquier espacio de tu hogar.',
      icon: <svg data-testid="icon-decoracion" className="text-emerald-600" />,
    },
    {
      title: 'Bajo mantenimiento',
      description: 'Nuestras plantas son fáciles de cuidar, perfectas para principiantes.',
      icon: <svg data-testid="icon-mantenimiento" className="text-emerald-600" />,
    },
  ],
}));

describe('PlantCharacteristics', () => {
  test('debe renderizar el título principal', () => {
    render(<PlantCharacteristics />);
    expect(screen.getByText('¿Por qué tener plantas en casa?')).toBeInTheDocument();
  });

  test('debe renderizar la descripción principal', () => {
    render(<PlantCharacteristics />);
    expect(
      screen.getByText(
        'Las plantas no son solo decoración, son compañeras que transforman nuestro espacio y bienestar.'
      )
    ).toBeInTheDocument();
  });

  test('debe renderizar las 4 características', () => {
    render(<PlantCharacteristics />);
    characteristics.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  test('debe renderizar los iconos de cada característica', () => {
    render(<PlantCharacteristics />);
    expect(screen.getByTestId('icon-purificadoras')).toBeInTheDocument();
    expect(screen.getByTestId('icon-bienestar')).toBeInTheDocument();
    expect(screen.getByTestId('icon-decoracion')).toBeInTheDocument();
    expect(screen.getByTestId('icon-mantenimiento')).toBeInTheDocument();
  });

  test('debe tener la estructura grid correcta', () => {
    render(<PlantCharacteristics />);
    const gridContainer = screen.getByText('¿Por qué tener plantas en casa?').parentElement?.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    const cards = document.querySelectorAll('.bg-white.p-6.rounded-lg');
    expect(cards.length).toBe(4);
  });
});
