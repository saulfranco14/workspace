import { FavoritesState } from '@/interfaces/favorites.interface';

export const initialState: FavoritesState = {
  collections: [],
  activeCollection: null,
  loading: false,
  error: null,
  duplicateError: null,
  isAddingToFavorites: false,
  isRemovingFromFavorites: false,
};
