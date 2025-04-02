import { renderHook } from '@testing-library/react';
import useAuthRedirect from '@/hooks/useAuthRedirect';

jest.useFakeTimers();

describe('useAuthRedirect', () => {
  test('debe redirigir cuando success es true después del delay', () => {
    const push = jest.fn();
    const router = { push } as any;

    renderHook(() => useAuthRedirect(true, router, '/dashboard'));

    expect(push).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  test('no debe redirigir cuando success es false', () => {
    const push = jest.fn();
    const router = { push } as any;

    renderHook(() => useAuthRedirect(false, router, '/dashboard'));

    jest.advanceTimersByTime(2000);

    expect(push).not.toHaveBeenCalled();
  });

  test('debe respetar el delay personalizado', () => {
    const push = jest.fn();
    const router = { push } as any;

    renderHook(() => useAuthRedirect(true, router, '/dashboard', 1000));

    jest.advanceTimersByTime(500);
    expect(push).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  test('debe limpiar el timeout al desmontar', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const router = { push: jest.fn() } as any;

    const { unmount } = renderHook(() => useAuthRedirect(true, router));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
