import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterFormFields from '@/components/register/RegisterFormFields';

// Mock de styled-components para los componentes de estilos
jest.mock('@/styles/components/InputStyle', () => ({
  InputGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="input-group">{children}</div>,
  InputLabel: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  TextInput: React.forwardRef(({ id, type, placeholder, disabled, className, ...props }: any, ref) => (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      data-testid={id}
      {...props}
      ref={ref}
    />
  )),
  ErrorMessage: ({ children }: { children: React.ReactNode }) => <span data-testid="error-message">{children}</span>,
}));

jest.mock('@/styles/components/ButtonStyle', () => ({
  SubmitButton: ({ children, disabled, type }: any) => (
    <button type={type} disabled={disabled} data-testid="submit-button">
      {children}
    </button>
  ),
}));

jest.mock('@/styles/components/FormStyles', () => ({
  FormFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="form-footer">{children}</div>,
}));

describe('RegisterFormFields', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('debe renderizar todos los campos del formulario', () => {
    const { container } = render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={false} />);

    // Verificar que se renderizan los campos de entrada por sus placeholders
    expect(screen.getByPlaceholderText('Escribe tu correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu contraseña')).toBeInTheDocument();

    // Verificar las etiquetas
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Contraseña')).toBeInTheDocument();

    // Verificar botón de envío
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Crear mi cuenta gratis');

    // Verificar pie de formulario
    expect(screen.getByTestId('form-footer')).toBeInTheDocument();
  });

  test('debe mostrar el estado de carga cuando loading es true', () => {
    render(<RegisterFormFields onSubmit={mockOnSubmit} loading={true} success={false} />);

    expect(screen.getByTestId('submit-button')).toHaveTextContent('Creando cuenta...');
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('debe desactivar los campos cuando success es true', () => {
    render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={true} />);

    expect(screen.getByTestId('email')).toBeDisabled();
    expect(screen.getByTestId('password')).toBeDisabled();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('debe mostrar errores de validación cuando el email es inválido', async () => {
    const { container } = render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={false} />);

    // Ingresar un email inválido
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'emailinvalido' } });

    // Obtener el formulario y enviarlo
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    // Esperar a que aparezcan los mensajes de error
    await waitFor(() => {
      const errorMessages = screen.getAllByTestId('error-message');
      // Debe haber al menos un mensaje de error (email inválido)
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    // Verificar que no se llamó a onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('debe mostrar errores de validación cuando la contraseña es muy corta', async () => {
    const { container } = render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={false} />);

    // Ingresar un email válido pero contraseña corta
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'usuario@ejemplo.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });

    // Obtener el formulario y enviarlo
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    // Esperar a que aparezcan los mensajes de error
    await waitFor(() => {
      const errorMessages = screen.getAllByTestId('error-message');
      // Debe haber al menos un mensaje de error (contraseña muy corta)
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    // Verificar que no se llamó a onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('debe llamar a onSubmit con los datos correctos cuando el formulario es válido', async () => {
    const { container } = render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={false} />);

    // Datos válidos
    const validEmail = 'usuario@ejemplo.com';
    const validPassword = 'contraseña123';

    // Ingresar datos válidos
    fireEvent.change(screen.getByTestId('email'), { target: { value: validEmail } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: validPassword } });

    // Obtener el formulario y enviarlo
    const form = container.querySelector('form');
    fireEvent.submit(form!);

    // Esperar a que se llame a onSubmit
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      // Verificar que el primer argumento contiene los datos del formulario
      const firstArg = mockOnSubmit.mock.calls[0][0];
      expect(firstArg).toEqual({
        email: validEmail,
        password: validPassword,
      });
    });
  });
});
