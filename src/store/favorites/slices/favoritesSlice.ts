import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '@/app/store/favorites/initialState';
import { FavoriteCollection, FavoriteItem } from '@/interfaces/favorites.interface';
import {
  fetchUserFavoriteCollections,
  createFavoriteCollection,
  addToFavorites,
  removeFromFavorites,
  removeFavoriteCollection,
} from '@/app/store/favorites/thunk/favoritesThunk';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setActiveCollection: (state, action: PayloadAction<FavoriteCollection | null>) => {
      state.activeCollection = action.payload;
    },
    clearFavoritesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFavoriteCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavoriteCollections.fulfilled, (state, action: PayloadAction<FavoriteCollection[]>) => {
        state.loading = false;
        state.collections = action.payload;

        if (action.payload.length > 0 && !state.activeCollection) {
          state.activeCollection = action.payload[0];
        }
      })
      .addCase(fetchUserFavoriteCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createFavoriteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFavoriteCollection.fulfilled, (state, action: PayloadAction<FavoriteCollection>) => {
        state.loading = false;
        state.collections.unshift(action.payload);
        state.activeCollection = action.payload;
      })
      .addCase(createFavoriteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addToFavorites.pending, (state) => {
        state.isAddingToFavorites = true;
        state.error = null;
      })
      .addCase(
        addToFavorites.fulfilled,
        (state, action: PayloadAction<{ item: FavoriteItem; collectionId: string }>) => {
          state.isAddingToFavorites = false;

          const { item, collectionId } = action.payload;
          const collectionIndex = state.collections.findIndex((col) => col.id === collectionId);

          if (collectionIndex !== -1) {
            if (!state.collections[collectionIndex].items) {
              state.collections[collectionIndex].items = [];
            }
            state.collections[collectionIndex].items?.push(item);

            if (state.activeCollection?.id === collectionId) {
              if (!state.activeCollection.items) {
                state.activeCollection.items = [];
              }
              state.activeCollection.items.push(item);
            }
          }
        }
      )
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isAddingToFavorites = false;
        state.error = action.payload as string;
      })

      .addCase(removeFromFavorites.pending, (state) => {
        state.isRemovingFromFavorites = true;
        state.error = null;
      })
      .addCase(
        removeFromFavorites.fulfilled,
        (state, action: PayloadAction<{ itemId: string; collectionId: string }>) => {
          state.isRemovingFromFavorites = false;

          const { itemId, collectionId } = action.payload;
          const collectionIndex = state.collections.findIndex((col) => col.id === collectionId);

          if (collectionIndex !== -1 && state.collections[collectionIndex].items) {
            state.collections[collectionIndex].items = state.collections[collectionIndex].items?.filter(
              (item) => item.id !== itemId
            );

            if (state.activeCollection?.id === collectionId && state.activeCollection.items) {
              state.activeCollection.items = state.activeCollection.items.filter((item) => item.id !== itemId);
            }
          }
        }
      )
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isRemovingFromFavorites = false;
        state.error = action.payload as string;
      })

      .addCase(removeFavoriteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteCollection.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;

        const collectionId = action.payload;
        state.collections = state.collections.filter((col) => col.id !== collectionId);

        if (state.activeCollection?.id === collectionId) {
          state.activeCollection = state.collections.length > 0 ? state.collections[0] : null;
        }
      })
      .addCase(removeFavoriteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveCollection, clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
