import { characteristics } from '@/helpers/PlanCharacteristics';
import React from 'react';
import { render } from '@testing-library/react';

describe('PlanCharacteristics', () => {
  it('debe contener 4 características', () => {
    expect(characteristics).toHaveLength(4);
  });

  it('debe contener los títulos correctos', () => {
    const expectedTitles = ['Purificadoras de aire', 'Bienestar emocional', 'Decoración natural', 'Bajo mantenimiento'];

    const actualTitles = characteristics.map((char) => char.title);
    expect(actualTitles).toEqual(expectedTitles);
  });

  it('debe contener descripciones para cada característica', () => {
    characteristics.forEach((char) => {
      expect(char.description).toBeDefined();
      expect(typeof char.description).toBe('string');
      expect(char.description.length).toBeGreaterThan(0);
    });
  });

  it('debe contener iconos SVG para cada característica', () => {
    characteristics.forEach((char) => {
      expect(char.icon).toBeDefined();

      const { container } = render(<div>{char.icon}</div>);
      const svg = container.querySelector('svg');

      expect(svg).toBeTruthy();
      expect(svg?.tagName.toLowerCase()).toBe('svg');
    });
  });
});
