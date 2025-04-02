import {
  mockSupabase,
  mockSelect,
  mockEq,
  mockFrom,
  mockInsert,
  mockDelete,
  mockOrder,
  mockLimit,
  mockMaybeSingle,
  resetMocks,
} from '../__mocks__/supabaseMock';
import { FavoriteCollection, FavoriteItem } from '@/interfaces/favorites.interface';

// Mockear getFingerprint desde deviceService
jest.mock('@/services/deviceService', () => ({
  getFingerprint: jest.fn(),
}));

// Mockear console
console.warn = jest.fn();
console.error = jest.fn();

// Mockear supabase client
jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

// Importamos después de los mocks
import * as deviceService from '@/services/deviceService';
import * as favoritesServiceModule from '@/services/favoritesService';

describe('Favorites Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.warn as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();

    (deviceService.getFingerprint as jest.Mock).mockReset();
    mockSupabase.auth.getUser.mockReset();
  });

  describe('getUserFavoriteCollections', () => {
    it('debe obtener colecciones para usuario autenticado', async () => {
      const mockUserId = 'user123';
      const mockUser = { id: mockUserId };
      const mockCollections = [
        {
          id: 'col1',
          name: 'Colección 1',
          user_id: mockUserId,
          items: [{ id: 'item1', product: { id: 'prod1', name: 'Producto 1' } }],
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue(null);

      // Configurar el mock para simular el comportamiento de query y await query
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return callback({
            data: mockCollections,
            error: null,
          });
        }),
      };

      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await favoritesServiceModule.getUserFavoriteCollections();

      expect(mockFrom).toHaveBeenCalledWith('favorite_collections');
      expect(result).toEqual(mockCollections);
    });

    it('debe obtener colecciones usando fingerprint cuando no hay usuario', async () => {
      const mockFingerprint = 'device123';
      const mockCollections = [
        {
          id: 'col1',
          name: 'Colección 1',
          device_fingerprint: mockFingerprint,
          items: [],
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue(mockFingerprint);

      // Configurar el mock para simular el comportamiento de query y await query
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return callback({
            data: mockCollections,
            error: null,
          });
        }),
      };

      mockSelect.mockReturnValueOnce(mockQuery);

      const result = await favoritesServiceModule.getUserFavoriteCollections();

      expect(mockFrom).toHaveBeenCalledWith('favorite_collections');
      expect(result).toEqual(mockCollections);
    });

    it('debe retornar array vacío si no hay fingerprint ni usuario', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue(null);

      const result = await favoritesServiceModule.getUserFavoriteCollections();

      expect(console.warn).toHaveBeenCalledWith('No se pudo obtener fingerprint ni usuario autenticado');
      expect(result).toEqual([]);
    });

    it('debe manejar errores en la consulta', async () => {
      const mockUserId = 'user123';
      const mockUser = { id: mockUserId };
      const mockError = new Error('Error de base de datos');

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue(null);

      // Configurar el mock para simular un error
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return callback({
            data: null,
            error: mockError,
          });
        }),
      };

      mockSelect.mockReturnValueOnce(mockQuery);

      await expect(favoritesServiceModule.getUserFavoriteCollections()).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error al obtener colecciones de favoritos:', mockError);
    });
  });

  describe('getCollection', () => {
    it('debe obtener una colección de favoritos', async () => {
      const mockCollection = {
        id: 'col1',
        name: 'Colección 1',
        items: [{ id: 'item1', product: { id: 'prod1', name: 'Producto 1' } }],
      };

      // Configurar mock para que getCollection obtenga datos
      mockMaybeSingle.mockResolvedValueOnce({
        data: mockCollection,
        error: null,
      });

      const result = await favoritesServiceModule.getCollection();

      expect(mockFrom).toHaveBeenCalledWith('favorite_collections');
      expect(result).toEqual(mockCollection);
    });

    it('debe manejar errores al obtener una colección', async () => {
      const mockError = new Error('Error de base de datos');

      // Configurar mock para simular error
      mockMaybeSingle.mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      const result = await favoritesServiceModule.getCollection();

      expect(console.error).toHaveBeenCalledWith('Error al obtener colección de favoritos:', mockError);
      expect(console.error).toHaveBeenCalledWith('Error en getCollection:', mockError);
      expect(result).toBeNull();
    });
  });

  describe('createCollection', () => {
    it('debe crear una colección para usuario autenticado', async () => {
      const mockUserId = 'user123';
      const mockUser = { id: mockUserId };
      const mockCollectionName = 'Mi colección';
      const mockCollection = {
        id: 'col1',
        name: mockCollectionName,
        user_id: mockUserId,
        device_fingerprint: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        items: [],
      } as FavoriteCollection;

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue(null);

      // Habilitar la creación de colección
      mockInsert.mockReturnValueOnce({
        data: null,
        error: null,
      });

      // Configurar respuesta para getCollection (usada internamente por createCollection)
      mockSelect.mockReturnValueOnce({ order: mockOrder });
      mockOrder.mockReturnValueOnce({ limit: mockLimit });
      mockLimit.mockReturnValueOnce({ maybeSingle: mockMaybeSingle });
      mockMaybeSingle.mockReturnValueOnce({
        data: mockCollection,
        error: null,
      });

      const result = await favoritesServiceModule.createCollection(mockCollectionName);

      expect(mockFrom).toHaveBeenCalledWith('favorite_collections');
      expect(result).toEqual(mockCollection);
    });

    it('debe crear una colección usando fingerprint', async () => {
      const mockFingerprint = 'device123';
      const mockCollectionName = 'Mi colección';
      const mockCollection = {
        id: 'col1',
        name: mockCollectionName,
        device_fingerprint: mockFingerprint,
        user_id: null,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        items: [],
      } as FavoriteCollection;

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue(mockFingerprint);

      // Habilitar la creación de colección
      mockInsert.mockReturnValueOnce({
        data: null,
        error: null,
      });

      // Configurar respuesta para getCollection (usada internamente por createCollection)
      mockSelect.mockReturnValueOnce({ order: mockOrder });
      mockOrder.mockReturnValueOnce({ limit: mockLimit });
      mockLimit.mockReturnValueOnce({ maybeSingle: mockMaybeSingle });
      mockMaybeSingle.mockReturnValueOnce({
        data: mockCollection,
        error: null,
      });

      const result = await favoritesServiceModule.createCollection(mockCollectionName);

      expect(mockSupabase.from).toHaveBeenCalledWith('favorite_collections');
      expect(result).toEqual(mockCollection);
    });

    it('debe manejar errores al crear una colección', async () => {
      const mockError = new Error('Error de base de datos');
      const mockCollectionName = 'Mi colección';

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (deviceService.getFingerprint as jest.Mock).mockResolvedValue('device123');

      mockSupabase.from.mockImplementationOnce(() => ({
        insert: () =>
          Promise.resolve({
            data: null,
            error: mockError,
          }),
      }));

      await expect(favoritesServiceModule.createCollection(mockCollectionName)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error al crear colección de favoritos :O', mockError);
    });
  });

  describe('addProductToFavorites', () => {
    it('debe añadir un producto a favoritos', async () => {
      const mockProductId = 'prod123';
      const mockCollectionId = 'col123';
      const mockFavoriteItem = {
        id: 'fav1',
        collection_id: mockCollectionId,
        product_id: mockProductId,
      };

      // Habilitar la inserción del ítem
      mockInsert.mockReturnValueOnce({
        data: null,
        error: null,
      });

      // Configurar respuesta para getFavoriteByProductId (usada internamente)
      mockSelect.mockReturnValueOnce({ order: mockOrder });
      mockOrder.mockReturnValueOnce({ limit: mockLimit });
      mockLimit.mockReturnValueOnce({ maybeSingle: mockMaybeSingle });
      mockMaybeSingle.mockReturnValueOnce({
        data: mockFavoriteItem,
        error: null,
      });

      const result = await favoritesServiceModule.addProductToFavorites(mockProductId, mockCollectionId);

      expect(mockFrom).toHaveBeenCalledWith('favorite_items');
      expect(result).toEqual(mockFavoriteItem);
    });

    it('debe manejar errores al añadir un producto a favoritos', async () => {
      const mockError = new Error('Error de base de datos');
      const mockProductId = 'prod123';
      const mockCollectionId = 'col123';

      mockSupabase.from.mockImplementationOnce(() => ({
        insert: () =>
          Promise.resolve({
            data: null,
            error: mockError,
          }),
      }));

      await expect(favoritesServiceModule.addProductToFavorites(mockProductId, mockCollectionId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error al añadir producto a favoritos:', mockError);
    });
  });

  describe('removeProductFromFavorites', () => {
    it('debe eliminar un producto de favoritos', async () => {
      const mockItemId = 'item123';
      const mockCollectionId = 'col123';

      mockSupabase.from.mockImplementationOnce(() => ({
        delete: () => ({
          eq: () => ({
            eq: () =>
              Promise.resolve({
                data: null,
                error: null,
              }),
          }),
        }),
      }));

      const result = await favoritesServiceModule.removeProductFromFavorites(mockItemId, mockCollectionId);

      expect(mockSupabase.from).toHaveBeenCalledWith('favorite_items');
      expect(result).toEqual({ itemId: mockItemId, collectionId: mockCollectionId });
    });

    it('debe manejar errores al eliminar un producto de favoritos', async () => {
      const mockError = new Error('Error de base de datos');
      const mockItemId = 'item123';
      const mockCollectionId = 'col123';

      mockSupabase.from.mockImplementationOnce(() => ({
        delete: () => ({
          eq: () => ({
            eq: () =>
              Promise.resolve({
                data: null,
                error: mockError,
              }),
          }),
        }),
      }));

      await expect(favoritesServiceModule.removeProductFromFavorites(mockItemId, mockCollectionId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error al eliminar producto de favoritos:', mockError);
    });
  });

  describe('deleteCollection', () => {
    it('debe eliminar una colección', async () => {
      const mockCollectionId = 'col123';

      mockSupabase.from.mockImplementationOnce(() => ({
        delete: () => ({
          eq: () =>
            Promise.resolve({
              data: null,
              error: null,
            }),
        }),
      }));

      const result = await favoritesServiceModule.deleteCollection(mockCollectionId);

      expect(mockSupabase.from).toHaveBeenCalledWith('favorite_collections');
      expect(result).toEqual(mockCollectionId);
    });

    it('debe manejar errores al eliminar una colección', async () => {
      const mockError = new Error('Error de base de datos');
      const mockCollectionId = 'col123';

      mockSupabase.from.mockImplementationOnce(() => ({
        delete: () => ({
          eq: () =>
            Promise.resolve({
              data: null,
              error: mockError,
            }),
        }),
      }));

      await expect(favoritesServiceModule.deleteCollection(mockCollectionId)).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error al eliminar colección de favoritos:', mockError);
    });
  });

  describe('getFavoriteByProductId', () => {
    it('debe obtener un item favorito por ID de producto', async () => {
      const mockFavoriteItem = {
        id: 'fav1',
        collection_id: 'col123',
        product_id: 'prod123',
      };

      mockSupabase.from.mockImplementationOnce(() => ({
        select: () => ({
          order: () => ({
            limit: () => ({
              maybeSingle: () =>
                Promise.resolve({
                  data: mockFavoriteItem,
                  error: null,
                }),
            }),
          }),
        }),
      }));

      const result = await favoritesServiceModule.getFavoriteByProductId();

      expect(result).toEqual(mockFavoriteItem);
    });

    it('debe manejar errores al obtener un item favorito', async () => {
      const mockError = new Error('Error de base de datos');

      mockSupabase.from.mockImplementationOnce(() => ({
        select: () => ({
          order: () => ({
            limit: () => ({
              maybeSingle: () =>
                Promise.resolve({
                  data: null,
                  error: mockError,
                }),
            }),
          }),
        }),
      }));

      const result = await favoritesServiceModule.getFavoriteByProductId();

      expect(console.error).toHaveBeenCalledWith('Error al obtener colección de favoritos:', mockError);
      expect(console.error).toHaveBeenCalledWith('Error en getCollection:', mockError);
      expect(result).toBeNull();
    });
  });
});
