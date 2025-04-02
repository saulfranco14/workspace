import { renderHook, act } from '@testing-library/react';
import { useClientReady } from '@/hooks/useClientReady';

jest.useFakeTimers();

describe('useClientReady', () => {
  test('debe devolver false inicialmente y luego true después del tiempo de espera', () => {
    const { result } = renderHook(() => useClientReady());
    expect(result.current).toBe(false);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(true);
  });

  test('debe respetar el delay personalizado', () => {
    const { result } = renderHook(() => useClientReady(200));
    expect(result.current).toBe(false);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe(true);
  });

  test('debe limpiar el timeout al desmontar', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useClientReady());
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
