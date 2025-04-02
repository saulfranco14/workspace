import { renderHook } from '@testing-library/react';
import { useSingleEffect } from '@/hooks/useSingleEffect';

describe('useSingleEffect', () => {
  test('debe ejecutar el efecto solo una vez', () => {
    const effect = jest.fn();

    const { rerender } = renderHook(() => useSingleEffect(effect));

    expect(effect).toHaveBeenCalledTimes(1);

    rerender();
    expect(effect).toHaveBeenCalledTimes(1);

    rerender();
    expect(effect).toHaveBeenCalledTimes(1);
  });

  test('debe ejecutar la función de limpieza al desmontar', () => {
    const cleanup = jest.fn();
    const effect = jest.fn().mockReturnValue(cleanup);

    const { unmount } = renderHook(() => useSingleEffect(effect));

    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
