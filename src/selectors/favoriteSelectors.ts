import { RootState } from '@/store/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectFavoritesState = (state: RootState) => state.favorites;
export const selectFavoriteCollections = (state: RootState) => state.favorites.collections;
export const selectActiveCollection = (state: RootState) => state.favorites.activeCollection;
export const selectFavoritesLoading = (state: RootState) => state.favorites.loading;
export const selectFavoritesError = (state: RootState) => state.favorites.error;
export const selectDuplicateError = (state: RootState) => state.favorites.duplicateError;
export const selectIsAddingToFavorites = (state: RootState) => state.favorites.isAddingToFavorites;
export const selectIsRemovingFromFavorites = (state: RootState) => state.favorites.isRemovingFromFavorites;

export const selectActiveCollectionProducts = createSelector([selectActiveCollection], (activeCollection) => {
  if (!activeCollection || !activeCollection.items) {
    return [];
  }

  return activeCollection.items.map((item) => item.product).filter(Boolean);
});

export const makeSelectIsProductInFavorites = () => {
  return createSelector([selectFavoriteCollections, (_, productId: string) => productId], (collections, productId) => {
    return collections.some((collection) => collection.items?.some((item) => item.product_id === productId));
  });
};

export const makeSelectIsProductInActiveCollection = () => {
  return createSelector(
    [selectActiveCollection, (_, productId: string) => productId],
    (activeCollection, productId) => {
      if (!activeCollection || !activeCollection.items) {
        return false;
      }

      return activeCollection.items.some((item) => item.product_id === productId);
    }
  );
};

export const makeSelectFavoriteItemByProductId = () => {
  return createSelector(
    [selectActiveCollection, (_, productId: string) => productId],
    (activeCollection, productId) => {
      if (!activeCollection || !activeCollection.items) {
        return null;
      }

      return activeCollection.items.find((item) => item.product_id === productId) || null;
    }
  );
};

export const selectActiveCollectionDebugInfo = createSelector([selectActiveCollection], (activeCollection) => {
  if (!activeCollection) {
    return 'No hay colección activa';
  }

  return {
    id: activeCollection.id,
    name: activeCollection.name,
    itemCount: activeCollection.items?.length || 0,
  };
});
