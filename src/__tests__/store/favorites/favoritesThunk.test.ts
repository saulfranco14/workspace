import {
  fetchUserFavoriteCollections,
  createFavoriteCollection,
  addToFavorites,
  removeFromFavorites,
  removeFavoriteCollection,
} from '@/store/favorites/thunk/favoritesThunk';
import * as favoritesService from '@/services/favoritesService';
import { FavoriteCollection, FavoriteItem } from '@/interfaces/favorites.interface';
import { Product } from '@/interfaces/product.interface';

jest.mock('@/services/favoritesService');

describe('FavoritesThunks', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUserFavoriteCollections', () => {
    test('debe obtener las colecciones de favoritos con éxito', async () => {
      (favoritesService.getUserFavoriteCollections as jest.Mock).mockResolvedValue([mockCollection]);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchUserFavoriteCollections()(dispatch, getState, undefined);

      expect(favoritesService.getUserFavoriteCollections).toHaveBeenCalled();
      expect(result.payload).toEqual([mockCollection]);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al obtener las colecciones', async () => {
      const errorMessage = 'Error al obtener colecciones';
      (favoritesService.getUserFavoriteCollections as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchUserFavoriteCollections()(dispatch, getState, undefined);

      expect(favoritesService.getUserFavoriteCollections).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('createFavoriteCollection', () => {
    test('debe crear una colección de favoritos con éxito', async () => {
      (favoritesService.createCollection as jest.Mock).mockResolvedValue(mockCollection);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await createFavoriteCollection('Mi colección')(dispatch, getState, undefined);

      expect(favoritesService.createCollection).toHaveBeenCalledWith('Mi colección');
      expect(result.payload).toEqual(mockCollection);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al crear una colección', async () => {
      const errorMessage = 'Error al crear colección';
      (favoritesService.createCollection as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await createFavoriteCollection('Mi colección')(dispatch, getState, undefined);

      expect(favoritesService.createCollection).toHaveBeenCalledWith('Mi colección');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('addToFavorites', () => {
    test('debe añadir un producto a favoritos con éxito', async () => {
      (favoritesService.addProductToFavorites as jest.Mock).mockResolvedValue(mockFavoriteItem);

      const payload = { productId: 'prod1', collectionId: 'col1' };
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await addToFavorites(payload)(dispatch, getState, undefined);

      expect(favoritesService.addProductToFavorites).toHaveBeenCalledWith('prod1', 'col1');
      expect(result.payload).toEqual({
        item: mockFavoriteItem,
        collectionId: 'col1',
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al añadir a favoritos', async () => {
      const errorMessage = 'Error al añadir a favoritos';
      (favoritesService.addProductToFavorites as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const payload = { productId: 'prod1', collectionId: 'col1' };
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await addToFavorites(payload)(dispatch, getState, undefined);

      expect(favoritesService.addProductToFavorites).toHaveBeenCalledWith('prod1', 'col1');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('removeFromFavorites', () => {
    test('debe eliminar un producto de favoritos con éxito', async () => {
      (favoritesService.removeProductFromFavorites as jest.Mock).mockResolvedValue({
        itemId: 'fav1',
        collectionId: 'col1',
      });

      const payload = { itemId: 'fav1', collectionId: 'col1' };
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await removeFromFavorites(payload)(dispatch, getState, undefined);

      expect(favoritesService.removeProductFromFavorites).toHaveBeenCalledWith('fav1', 'col1');
      expect(result.payload).toEqual({
        itemId: 'fav1',
        collectionId: 'col1',
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al eliminar de favoritos', async () => {
      const errorMessage = 'Error al eliminar de favoritos';
      (favoritesService.removeProductFromFavorites as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const payload = { itemId: 'fav1', collectionId: 'col1' };
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await removeFromFavorites(payload)(dispatch, getState, undefined);

      expect(favoritesService.removeProductFromFavorites).toHaveBeenCalledWith('fav1', 'col1');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('removeFavoriteCollection', () => {
    test('debe eliminar una colección de favoritos con éxito', async () => {
      (favoritesService.deleteCollection as jest.Mock).mockResolvedValue('col1');

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await removeFavoriteCollection('col1')(dispatch, getState, undefined);

      expect(favoritesService.deleteCollection).toHaveBeenCalledWith('col1');
      expect(result.payload).toBe('col1');
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al eliminar una colección', async () => {
      const errorMessage = 'Error al eliminar colección';
      (favoritesService.deleteCollection as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await removeFavoriteCollection('col1')(dispatch, getState, undefined);

      expect(favoritesService.deleteCollection).toHaveBeenCalledWith('col1');
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });
});
