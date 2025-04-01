import { useEffect, useRef } from 'react';

export const useSingleEffect = (effect: () => void | (() => void)) => {
  const hasRun = useRef<boolean>(false);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      cleanup.current = effect() ?? null;
    }
    return () => {
      if (hasRun.current && cleanup.current) {
        cleanup.current();
      }
    };
  }, []);
};
