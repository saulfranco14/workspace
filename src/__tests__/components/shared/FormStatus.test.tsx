import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormStatus from '@/components/shared/FormStatus';

// Mock del estilo AlertMessage
jest.mock('@/styles/components/AlertStyle', () => ({
  AlertMessage: ({ children, type }: { children: React.ReactNode; type: string }) => (
    <div data-testid={`alert-${type}`} className={`alert-${type}`}>
      {children}
    </div>
  ),
}));

describe('FormStatus', () => {
  test('no debe renderizar nada cuando no hay error ni éxito', () => {
    const { container } = render(<FormStatus error={null} success={false} successMessage="Operación exitosa" />);

    expect(container).toBeEmptyDOMElement();
  });

  test('debe mostrar mensaje de error cuando hay un error', () => {
    const errorMessage = 'Ha ocurrido un error';

    render(<FormStatus error={errorMessage} success={false} successMessage="Operación exitosa" />);

    const errorAlert = screen.getByTestId('alert-error');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(errorMessage);
  });

  test('debe mostrar mensaje de éxito cuando success es true', () => {
    const successMessage = 'Operación completada con éxito';

    render(<FormStatus error={null} success={true} successMessage={successMessage} />);

    const successAlert = screen.getByTestId('alert-success');
    expect(successAlert).toBeInTheDocument();
    expect(successAlert).toHaveTextContent(successMessage);
  });

  test('debe priorizar el error si hay tanto error como éxito', () => {
    const errorMessage = 'Ha ocurrido un error';
    const successMessage = 'Operación completada con éxito';

    render(<FormStatus error={errorMessage} success={true} successMessage={successMessage} />);

    // Ambos mensajes deberían mostrarse
    const errorAlert = screen.getByTestId('alert-error');
    const successAlert = screen.getByTestId('alert-success');

    expect(errorAlert).toBeInTheDocument();
    expect(successAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(errorMessage);
    expect(successAlert).toHaveTextContent(successMessage);
  });
});
