import favoritesReducer, { setActiveCollection, clearFavoritesError } from '@/store/favorites/slices/favoritesSlice';
import { initialState } from '@/store/favorites/initialState';
import {
  fetchUserFavoriteCollections,
  createFavoriteCollection,
  addToFavorites,
  removeFromFavorites,
  removeFavoriteCollection,
} from '@/store/favorites/thunk/favoritesThunk';
import { FavoriteCollection, FavoriteItem } from '@/interfaces/favorites.interface';
import { Product } from '@/interfaces/product.interface';

describe('FavoritesSlice reducers', () => {
  test('debe devolver el estado inicial', () => {
    expect(favoritesReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('setActiveCollection debe establecer la colección activa', () => {
    const mockCollection: FavoriteCollection = {
      id: 'col1',
      name: 'Mi colección',
      user_id: 'user123',
      device_fingerprint: null,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      items: [],
    };

    expect(favoritesReducer(initialState, setActiveCollection(mockCollection))).toEqual({
      ...initialState,
      activeCollection: mockCollection,
    });

    const stateWithActiveCollection = {
      ...initialState,
      activeCollection: mockCollection,
    };

    expect(favoritesReducer(stateWithActiveCollection, setActiveCollection(null))).toEqual({
      ...initialState,
      activeCollection: null,
    });
  });

  test('clearFavoritesError debe limpiar los errores', () => {
    const previousState = {
      ...initialState,
      error: 'Error previo',
    };

    expect(favoritesReducer(previousState, clearFavoritesError())).toEqual({
      ...previousState,
      error: null,
    });
  });
});

describe('FavoritesSlice extraReducers', () => {
  const mockProduct: Product = {
    id: 'prod1',
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 10.99,
    image_url: 'imagen1.jpg',
    category_id: 'cat1',
    stock: 10,
  };

  const mockFavoriteItem: FavoriteItem = {
    id: 'fav1',
    collection_id: 'col1',
    product_id: 'prod1',
    product: mockProduct,
    added_at: '2023-01-01',
  };

  const mockCollection: FavoriteCollection = {
    id: 'col1',
    name: 'Mi colección',
    user_id: 'user123',
    device_fingerprint: null,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    items: [mockFavoriteItem],
  };

  describe('fetchUserFavoriteCollections', () => {
    test('fetchUserFavoriteCollections.pending debe establecer loading y resetear errores', () => {
      const action = { type: fetchUserFavoriteCollections.pending.type };
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('fetchUserFavoriteCollections.fulfilled debe actualizar las colecciones', () => {
      const mockCollections = [mockCollection];

      const action = {
        type: fetchUserFavoriteCollections.fulfilled.type,
        payload: mockCollections,
      };

      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        collections: mockCollections,
        activeCollection: mockCollections[0],
      });
    });

    test('fetchUserFavoriteCollections.rejected debe manejar errores', () => {
      const action = {
        type: fetchUserFavoriteCollections.rejected.type,
        payload: 'Error al obtener colecciones',
      };

      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al obtener colecciones',
      });
    });
  });

  describe('createFavoriteCollection', () => {
    test('createFavoriteCollection.pending debe establecer loading y resetear errores', () => {
      const action = { type: createFavoriteCollection.pending.type };
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('createFavoriteCollection.fulfilled debe añadir la nueva colección', () => {
      const newCollection: FavoriteCollection = {
        id: 'col2',
        name: 'Nueva colección',
        user_id: 'user123',
        device_fingerprint: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        items: [],
      };

      const stateWithCollections = {
        ...initialState,
        collections: [mockCollection],
      };

      const action = {
        type: createFavoriteCollection.fulfilled.type,
        payload: newCollection,
      };

      const state = favoritesReducer(stateWithCollections, action);

      expect(state.collections).toHaveLength(2);
      expect(state.collections[0]).toEqual(newCollection);
      expect(state.activeCollection).toEqual(newCollection);
    });

    test('createFavoriteCollection.rejected debe manejar errores', () => {
      const action = {
        type: createFavoriteCollection.rejected.type,
        payload: 'Error al crear colección',
      };

      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al crear colección',
      });
    });
  });

  describe('addToFavorites', () => {
    test('addToFavorites.pending debe establecer isAddingToFavorites y resetear errores', () => {
      const action = { type: addToFavorites.pending.type };
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isAddingToFavorites: true,
        error: null,
      });
    });

    test('addToFavorites.fulfilled debe añadir el item a la colección correspondiente', () => {
      const stateWithCollections = {
        ...initialState,
        collections: [mockCollection],
        activeCollection: mockCollection,
      };

      const newFavoriteItem: FavoriteItem = {
        id: 'fav2',
        collection_id: 'col1',
        product_id: 'prod2',
        product: {
          ...mockProduct,
          id: 'prod2',
          name: 'Producto 2',
        },
        added_at: '2023-01-01',
      };

      const action = {
        type: addToFavorites.fulfilled.type,
        payload: {
          item: newFavoriteItem,
          collectionId: 'col1',
        },
      };

      const state = favoritesReducer(stateWithCollections, action);

      expect(state.isAddingToFavorites).toBe(false);
      expect(state.collections[0].items).toHaveLength(2);
      expect(state.collections[0].items).toContainEqual(newFavoriteItem);
      expect(state.activeCollection?.items).toHaveLength(2);
      expect(state.activeCollection?.items).toContainEqual(newFavoriteItem);
    });

    test('addToFavorites.fulfilled debe manejar colecciones sin items iniciales', () => {
      const collectionWithoutItems: FavoriteCollection = {
        ...mockCollection,
        items: undefined,
      };

      const stateWithCollections = {
        ...initialState,
        collections: [collectionWithoutItems],
        activeCollection: collectionWithoutItems,
      };

      const newFavoriteItem: FavoriteItem = {
        id: 'fav2',
        collection_id: 'col1',
        product_id: 'prod2',
        product: {
          ...mockProduct,
          id: 'prod2',
          name: 'Producto 2',
        },
        added_at: '2023-01-01',
      };

      const action = {
        type: addToFavorites.fulfilled.type,
        payload: {
          item: newFavoriteItem,
          collectionId: 'col1',
        },
      };

      const state = favoritesReducer(stateWithCollections, action);

      expect(state.collections[0].items).toBeDefined();
      expect(state.collections[0].items).toHaveLength(1);
      expect(state.activeCollection?.items).toBeDefined();
      expect(state.activeCollection?.items).toHaveLength(1);
    });

    test('addToFavorites.rejected debe manejar errores', () => {
      const action = {
        type: addToFavorites.rejected.type,
        payload: 'Error al añadir a favoritos',
      };

      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isAddingToFavorites: false,
        error: 'Error al añadir a favoritos',
      });
    });
  });

  describe('removeFromFavorites', () => {
    test('removeFromFavorites.pending debe establecer isRemovingFromFavorites y resetear errores', () => {
      const action = { type: removeFromFavorites.pending.type };
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isRemovingFromFavorites: true,
        error: null,
      });
    });

    test('removeFromFavorites.fulfilled debe eliminar el item de la colección correspondiente', () => {
      const stateWithCollections = {
        ...initialState,
        collections: [mockCollection],
        activeCollection: mockCollection,
      };

      const action = {
        type: removeFromFavorites.fulfilled.type,
        payload: {
          itemId: 'fav1',
          collectionId: 'col1',
        },
      };

      const state = favoritesReducer(stateWithCollections, action);

      expect(state.isRemovingFromFavorites).toBe(false);
      expect(state.collections[0].items).toHaveLength(0);
      expect(state.activeCollection?.items).toHaveLength(0);
    });

    test('removeFromFavorites.rejected debe manejar errores', () => {
      const action = {
        type: removeFromFavorites.rejected.type,
        payload: 'Error al eliminar de favoritos',
      };

      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isRemovingFromFavorites: false,
        error: 'Error al eliminar de favoritos',
      });
    });
  });

  describe('removeFavoriteCollection', () => {
    test('removeFavoriteCollection.pending debe establecer loading y resetear errores', () => {
      const action = { type: removeFavoriteCollection.pending.type };
      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    test('removeFavoriteCollection.fulfilled debe eliminar la colección', () => {
      const collection1 = { ...mockCollection, id: 'col1' };
      const collection2 = { ...mockCollection, id: 'col2' };

      const stateWithCollections = {
        ...initialState,
        collections: [collection1, collection2],
        activeCollection: collection1,
      };

      const action = {
        type: removeFavoriteCollection.fulfilled.type,
        payload: 'col1',
      };

      const state = favoritesReducer(stateWithCollections, action);

      expect(state.loading).toBe(false);
      expect(state.collections).toHaveLength(1);
      expect(state.collections[0].id).toBe('col2');
      expect(state.activeCollection).toEqual(collection2);
    });

    test('removeFavoriteCollection.fulfilled debe establecer activeCollection a null si no quedan colecciones', () => {
      const stateWithOneCollection = {
        ...initialState,
        collections: [mockCollection],
        activeCollection: mockCollection,
      };

      const action = {
        type: removeFavoriteCollection.fulfilled.type,
        payload: 'col1',
      };

      const state = favoritesReducer(stateWithOneCollection, action);

      expect(state.collections).toHaveLength(0);
      expect(state.activeCollection).toBeNull();
    });

    test('removeFavoriteCollection.rejected debe manejar errores', () => {
      const action = {
        type: removeFavoriteCollection.rejected.type,
        payload: 'Error al eliminar colección',
      };

      const state = favoritesReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Error al eliminar colección',
      });
    });
  });
});
