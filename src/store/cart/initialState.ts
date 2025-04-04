import { CartState } from '@/interfaces/cart.interface';

export const initialState: CartState = {
  cart: null,
  items: [],
  loading: false,
  error: null,
  isOpen: false,
};
