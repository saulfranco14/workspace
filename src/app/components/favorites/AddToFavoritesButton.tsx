'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import styled from 'styled-components';
import { AppDispatch } from '@/app/store/store';
import {
  addToFavorites,
  removeFromFavorites,
  createFavoriteCollection,
} from '@/app/store/favorites/thunk/favoritesThunk';
import {
  selectFavoriteCollections,
  selectActiveCollection,
  makeSelectIsProductInActiveCollection,
  makeSelectFavoriteItemByProductId,
} from '@/selectors/favoriteSelectors';
import { setActiveCollection } from '@/app/store/favorites/slices/favoritesSlice';

interface AddToFavoritesButtonProps {
  productId: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AddToFavoritesButton: React.FC<AddToFavoritesButtonProps> = ({ productId, showText = false, size = 'md' }) => {
  const dispatch = useDispatch<AppDispatch>();
  const collections = useSelector(selectFavoriteCollections);
  const activeCollection = useSelector(selectActiveCollection);

  const selectIsProductInActiveCollection = makeSelectIsProductInActiveCollection();
  const selectFavoriteItemByProductId = makeSelectFavoriteItemByProductId();

  const isInFavorites = useSelector((state) => selectIsProductInActiveCollection(state, productId));
  const favoriteItem = useSelector((state) => selectFavoriteItemByProductId(state, productId));

  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  const handleToggleFavorite = () => {
    if (!activeCollection) {
      console.log('!activeCollection', activeCollection);
      if (collections.length === 0) {
        console.log('collections.length === 0');
        dispatch(createFavoriteCollection('Mis Favoritos'))
          .unwrap()
          .then((collection) => {
            dispatch(setActiveCollection(collection));
            dispatch(addToFavorites({ productId, collectionId: collection.id }));
          });
      } else {
        console.log('collections.length !== 0');
        if (collections.length === 1) {
          dispatch(setActiveCollection(collections[0]));
          dispatch(addToFavorites({ productId, collectionId: collections[0].id }));
        } else {
          setShowCollectionSelector(true);
        }
      }
    } else {
      console.log('isInFavorites', isInFavorites);
      if (isInFavorites && favoriteItem) {
        console.log('isInFavorites favoriteItem', favoriteItem.id, activeCollection.id);
        dispatch(
          removeFromFavorites({
            itemId: favoriteItem.id,
            collectionId: activeCollection.id,
          })
        );
      } else {
        console.log('addToFavorites', productId, activeCollection.id);
        dispatch(
          addToFavorites({
            productId,
            collectionId: activeCollection.id,
          })
        );
      }
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    const selectedCollection = collections.find((col) => col.id === collectionId);
    if (selectedCollection) {
      dispatch(setActiveCollection(selectedCollection));
    }
    dispatch(addToFavorites({ productId, collectionId }));
    setShowCollectionSelector(false);
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      setIsCreatingCollection(true);
      dispatch(createFavoriteCollection(newCollectionName.trim()))
        .unwrap()
        .then((collection) => {
          dispatch(setActiveCollection(collection));
          dispatch(addToFavorites({ productId, collectionId: collection.id }));
          setShowCollectionSelector(false);
          setNewCollectionName('');
        })
        .finally(() => {
          setIsCreatingCollection(false);
        });
    }
  };

  return (
    <>
      <FavoriteButton
        $isActive={isInFavorites}
        $size={size}
        onClick={handleToggleFavorite}
        aria-label={isInFavorites ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <FiHeart className={isInFavorites ? 'filled' : ''} />
        {showText && <span>{isInFavorites ? 'En favoritos' : 'Añadir a favoritos'}</span>}
      </FavoriteButton>

      {showCollectionSelector && (
        <CollectionSelectorOverlay onClick={() => setShowCollectionSelector(false)}>
          <CollectionSelectorModal onClick={(e) => e.stopPropagation()}>
            <h3>Guardar en colección</h3>

            <CollectionList>
              {collections.map((collection) => (
                <CollectionItem key={collection.id} onClick={() => handleAddToCollection(collection.id)}>
                  <FiHeart />
                  <span>{collection.name}</span>
                </CollectionItem>
              ))}
            </CollectionList>

            <CreateCollectionForm>
              <input
                type="text"
                placeholder="Nombre de nueva colección"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <button onClick={handleCreateCollection} disabled={isCreatingCollection || !newCollectionName.trim()}>
                Crear
              </button>
            </CreateCollectionForm>
          </CollectionSelectorModal>
        </CollectionSelectorOverlay>
      )}
    </>
  );
};

const FavoriteButton = styled.button<{ $isActive: boolean; $size: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${(props) => (props.$size === 'sm' ? '0.375rem' : props.$size === 'md' ? '0.625rem' : '0.75rem')};
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : 'white')};
  color: ${(props) => (props.$isActive ? 'var(--primary)' : '#4b5563')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : '#f9fafb')};
    border-color: ${(props) => (props.$isActive ? 'var(--primary-light)' : '#d1d5db')};
  }

  svg {
    font-size: ${(props) => (props.$size === 'sm' ? '1rem' : props.$size === 'md' ? '1.25rem' : '1.5rem')};
    stroke-width: ${(props) => (props.$isActive ? 2.5 : 2)};
    fill: ${(props) => (props.$isActive ? 'var(--primary)' : 'transparent')};
    color: ${(props) => (props.$isActive ? 'var(--primary)' : 'currentColor')};
  }

  .filled {
    fill: var(--primary);
  }
`;

const CollectionSelectorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CollectionSelectorModal = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: #1f2937;
  }
`;

const CollectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const CollectionItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border: none;
  border-radius: 0.375rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const CreateCollectionForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;

  input {
    flex: 1;
    padding: 0.625rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  button {
    padding: 0.625rem 1rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--primary-dark);
    }

    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

export default AddToFavoritesButton;
