'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiTrash2, FiPlus } from 'react-icons/fi';

import { AppDispatch } from '@/store/store';
import { createFavoriteCollection, removeFavoriteCollection } from '@/store/favorites/thunk/favoritesThunk';
import { setActiveCollection } from '@/store/favorites/slices/favoritesSlice';
import DroppableCollection from '@/components/favorites/DroppableCollection';
import {
  selectFavoriteCollections,
  selectActiveCollection,
  selectFavoritesLoading,
} from '@/selectors/favoriteSelectors';
import { FavoriteStyles } from '@/styles/components/FavoriteStyle';

const FavoriteCollections: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const collections = useSelector(selectFavoriteCollections);
  const activeCollection = useSelector(selectActiveCollection);
  const loading = useSelector(selectFavoritesLoading);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleSelectCollection = (collectionId: string) => {
    const collection = collections.find((col) => col.id === collectionId);
    if (collection) {
      dispatch(setActiveCollection(collection));
    }
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      dispatch(createFavoriteCollection(newCollectionName.trim()));
      setNewCollectionName('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteCollection = (collectionId: string) => {
    dispatch(removeFavoriteCollection(collectionId));
    setShowConfirmDelete(null);
  };

  if (loading && collections.length === 0) {
    return <FavoriteStyles.LoadingMessage>Cargando colecciones...</FavoriteStyles.LoadingMessage>;
  }

  return (
    <FavoriteStyles.Container>
      <FavoriteStyles.Header>
        <h2>Mis Colecciones</h2>
        <FavoriteStyles.AddButton onClick={() => setShowCreateForm(true)}>
          <FiPlus />
          <span>Nueva</span>
        </FavoriteStyles.AddButton>
      </FavoriteStyles.Header>

      {showCreateForm && (
        <FavoriteStyles.CreateForm>
          <input
            type="text"
            placeholder="Nombre de la colección"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            autoFocus
          />
          <FavoriteStyles.CreateFormButtons>
            <button className="cancel" onClick={() => setShowCreateForm(false)}>
              Cancelar
            </button>
            <button className="create" onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
              Crear
            </button>
          </FavoriteStyles.CreateFormButtons>
        </FavoriteStyles.CreateForm>
      )}

      {collections.length === 0 ? (
        <FavoriteStyles.EmptyCollections>
          <FiHeart size={48} />
          <p>No tienes colecciones de favoritos todavía</p>
          <button onClick={() => setShowCreateForm(true)}>Crear colección</button>
        </FavoriteStyles.EmptyCollections>
      ) : (
        <FavoriteStyles.CollectionsList>
          {collections.map((collection) => (
            <div key={collection.id} style={{ position: 'relative' }}>
              <DroppableCollection
                collectionId={collection.id}
                name={collection.name}
                itemCount={collection.items?.length || 0}
                isActive={activeCollection?.id === collection.id}
                onSelect={() => handleSelectCollection(collection.id)}
              />

              <FavoriteStyles.DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(collection.id);
                }}
                aria-label="Eliminar colección"
              >
                <FiTrash2 size={16} />
              </FavoriteStyles.DeleteButton>

              {showConfirmDelete === collection.id && (
                <FavoriteStyles.ConfirmDelete>
                  <p>¿Eliminar esta colección?</p>
                  <FavoriteStyles.ConfirmButtons>
                    <button
                      className="cancel"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirmDelete(null);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </FavoriteStyles.ConfirmButtons>
                </FavoriteStyles.ConfirmDelete>
              )}
            </div>
          ))}
        </FavoriteStyles.CollectionsList>
      )}
    </FavoriteStyles.Container>
  );
};

export default FavoriteCollections;
