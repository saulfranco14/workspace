'use client';

import { usePathname } from 'next/navigation';
import { getDisplayProducts } from '@/helpers/productHelpers';

export const useDisplayProducts = <T>(products: T[], limit: number = 4): T[] => {
  const pathname = usePathname();
  return getDisplayProducts(products, pathname, limit);
};
