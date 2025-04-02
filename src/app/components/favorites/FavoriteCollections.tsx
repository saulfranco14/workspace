'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiTrash2, FiPlus } from 'react-icons/fi';
import styled from 'styled-components';
import { AppDispatch } from '@/app/store/store';
import { createFavoriteCollection, removeFavoriteCollection } from '@/app/store/favorites/thunk/favoritesThunk';
import { setActiveCollection } from '@/app/store/favorites/slices/favoritesSlice';
import {
  selectFavoriteCollections,
  selectActiveCollection,
  selectFavoritesLoading,
} from '@/app/selectors/favoriteSelectors';

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
    return <LoadingMessage>Cargando colecciones...</LoadingMessage>;
  }

  return (
    <CollectionsContainer>
      <CollectionsHeader>
        <h2>Mis Colecciones</h2>
        <AddButton onClick={() => setShowCreateForm(!showCreateForm)}>
          <FiPlus />
          <span>Nueva colección</span>
        </AddButton>
      </CollectionsHeader>

      {showCreateForm && (
        <CreateForm>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Nombre de la colección"
          />
          <CreateFormButtons>
            <button
              className="cancel"
              onClick={() => {
                setShowCreateForm(false);
                setNewCollectionName('');
              }}
            >
              Cancelar
            </button>
            <button className="create" onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
              Crear
            </button>
          </CreateFormButtons>
        </CreateForm>
      )}

      {collections.length === 0 ? (
        <EmptyCollections>
          <FiHeart size={24} />
          <p>No tienes colecciones de favoritos</p>
          <button onClick={() => setShowCreateForm(true)}>Crear mi primera colección</button>
        </EmptyCollections>
      ) : (
        <>
          <CollectionsList>
            {collections.map((collection) => (
              <CollectionItem
                key={collection.id}
                onClick={() => handleSelectCollection(collection.id)}
                $isActive={activeCollection?.id === collection.id}
              >
                <CollectionInfo>
                  <HeartIcon $isActive={activeCollection?.id === collection.id}>
                    <FiHeart />
                  </HeartIcon>
                  <div>
                    <CollectionName>{collection.name}</CollectionName>
                    <ItemCount>
                      {collection.items?.length || 0} {collection.items?.length === 1 ? 'producto' : 'productos'}
                    </ItemCount>
                  </div>
                </CollectionInfo>

                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(collection.id);
                  }}
                >
                  <FiTrash2 />
                </DeleteButton>

                {showConfirmDelete === collection.id && (
                  <ConfirmDelete onClick={(e) => e.stopPropagation()}>
                    <p>¿Eliminar esta colección?</p>
                    <ConfirmButtons>
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
                    </ConfirmButtons>
                  </ConfirmDelete>
                )}
              </CollectionItem>
            ))}
          </CollectionsList>
        </>
      )}
    </CollectionsContainer>
  );
};

const CollectionsContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CollectionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-light);
  color: var(--primary);
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6f7ff;
  }
`;

const CreateForm = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  input {
    width: 100%;
    padding: 0.625rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
`;

const CreateFormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
    font-size: 0.875rem;
  }

  .cancel {
    background-color: #f3f4f6;
    color: #4b5563;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  .create {
    background-color: var(--primary);
    color: white;

    &:hover {
      background-color: var(--primary-dark);
    }

    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const EmptyCollections = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6b7280;
  text-align: center;

  svg {
    margin-bottom: 1rem;
    color: #9ca3af;
  }

  p {
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  button {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.625rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--primary-dark);
    }
  }
`;

const CollectionsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const CollectionItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : 'transparent')};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border-left: ${(props) => (props.$isActive ? '4px solid var(--primary)' : '4px solid transparent')};

  &:hover {
    background-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : '#f9fafb')};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CollectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: var(--primary);
  }
`;

const CollectionName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const ItemCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #ef4444;
  }
`;

const ConfirmDelete = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 40px;

  p {
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 0.75rem;
  }

  .cancel {
    background-color: #f3f4f6;
    color: #4b5563;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  .delete {
    background-color: #ef4444;
    color: white;

    &:hover {
      background-color: #dc2626;
    }
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

const HeartIcon = styled.div<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: var(--primary);
    fill: ${(props) => (props.$isActive ? 'var(--primary)' : 'transparent')};
    stroke-width: ${(props) => (props.$isActive ? '2.5' : '2')};
    transition:
      fill 0.2s ease,
      stroke-width 0.2s ease;
  }
`;

export default FavoriteCollections;
