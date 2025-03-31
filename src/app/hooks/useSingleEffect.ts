import { useEffect, useRef } from 'react';

export const useSingleEffect = (effect: () => void | (() => void), deps: any[] = []) => {
  const hasRun = useRef<boolean>(false);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!hasRun.current) {
      console.log('useSingleEffect: ejecutando efecto por primera vez');
      hasRun.current = true;
      cleanup.current = effect() ?? null;
    }
    return () => {
      if (hasRun.current && cleanup.current) {
        cleanup.current();
      }
    };
  }, []); // Eliminamos las dependencias para garantizar que solo se ejecute una vez
};
