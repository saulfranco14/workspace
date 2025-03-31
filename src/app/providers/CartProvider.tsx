'use client';

import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@/app/hooks/useSession';
import { fetchCart } from '@/app/store/cart/thunk/cartThunk';
import { useSingleEffect } from '@/app/hooks/useSingleEffect';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const dispatch = useDispatch();
  const { session } = useSession();

  useSingleEffect(() => {
    const userId = session?.user?.id;
    // @ts-ignore - Because fetchCart expects a specifically typed argument
    dispatch(fetchCart(userId));
  }, []);

  return <>{children}</>;
};

export default CartProvider;
