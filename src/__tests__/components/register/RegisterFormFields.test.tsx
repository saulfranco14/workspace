import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterFormFields from '@/components/register/RegisterFormFields';

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

    expect(screen.getByPlaceholderText('Escribe tu correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe tu contraseña')).toBeInTheDocument();
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Contraseña')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Crear mi cuenta gratis');
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

    fireEvent.change(screen.getByTestId('email'), { target: { value: 'emailinvalido' } });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      const errorMessages = screen.getAllByTestId('error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('debe mostrar errores de validación cuando la contraseña es muy corta', async () => {
    const { container } = render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={false} />);

    fireEvent.change(screen.getByTestId('email'), { target: { value: 'usuario@ejemplo.com' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      const errorMessages = screen.getAllByTestId('error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('debe llamar a onSubmit con los datos correctos cuando el formulario es válido', async () => {
    const { container } = render(<RegisterFormFields onSubmit={mockOnSubmit} loading={false} success={false} />);

    const validEmail = 'usuario@ejemplo.com';
    const validPassword = 'contraseña123';

    fireEvent.change(screen.getByTestId('email'), { target: { value: validEmail } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: validPassword } });

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      const firstArg = mockOnSubmit.mock.calls[0][0];
      expect(firstArg).toEqual({
        email: validEmail,
        password: validPassword,
      });
    });
  });
});
