import { Product } from '@/interfaces/product.interface';

export interface FavoriteItem {
  id: string;
  collection_id: string;
  product_id: string;
  product?: Product;
  added_at: string;
}

export interface FavoriteCollection {
  id: string;
  user_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
  device_fingerprint: string | null;
  items?: FavoriteItem[];
}

export interface FavoritesState {
  collections: FavoriteCollection[];
  activeCollection: FavoriteCollection | null;
  loading: boolean;
  error: string | null;
  isAddingToFavorites: boolean;
  isRemovingFromFavorites: boolean;
}
