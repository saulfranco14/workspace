'use client';

import { useEffect, useState } from 'react';

export function useClientReady(delay = 100) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isClient;
}
