export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
  };
}

export interface Cart {
  id: string;
  user_id: string | null;
  device_fingerprint: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface CartState {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}
