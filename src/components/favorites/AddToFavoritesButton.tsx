'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { AppDispatch } from '@/store/store';
import { addToFavorites, removeFromFavorites, createFavoriteCollection } from '@/store/favorites/thunk/favoritesThunk';
import {
  selectFavoriteCollections,
  selectActiveCollection,
  makeSelectIsProductInActiveCollection,
  makeSelectFavoriteItemByProductId,
} from '@/selectors/favoriteSelectors';
import { setActiveCollection } from '@/store/favorites/slices/favoritesSlice';
import { AddFavoriteStyle } from '@/styles/components/FavoriteAddStyle';

type AddToFavoritesButtonProps = {
  productId: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

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
      if (collections.length === 0) {
        dispatch(createFavoriteCollection('Mis Favoritos'))
          .unwrap()
          .then((collection) => {
            dispatch(setActiveCollection(collection));
            dispatch(addToFavorites({ productId, collectionId: collection.id }));
          });
      } else {
        if (collections.length === 1) {
          dispatch(setActiveCollection(collections[0]));
          dispatch(addToFavorites({ productId, collectionId: collections[0].id }));
        } else {
          setShowCollectionSelector(true);
        }
      }
    } else {
      if (isInFavorites && favoriteItem) {
        dispatch(
          removeFromFavorites({
            itemId: favoriteItem.id,
            collectionId: activeCollection.id,
          })
        );
      } else {
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
      <AddFavoriteStyle.FavoriteButton
        $isActive={isInFavorites}
        $size={size}
        onClick={handleToggleFavorite}
        aria-label={isInFavorites ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <FiHeart className={isInFavorites ? 'filled' : ''} />
        {showText && <span>{isInFavorites ? 'En favoritos' : 'Añadir a favoritos'}</span>}
      </AddFavoriteStyle.FavoriteButton>

      {showCollectionSelector && (
        <AddFavoriteStyle.CollectionSelectorOverlay onClick={() => setShowCollectionSelector(false)}>
          <AddFavoriteStyle.CollectionSelectorModal onClick={(e) => e.stopPropagation()}>
            <h3>Guardar en colección</h3>

            <AddFavoriteStyle.CollectionList>
              {collections.map((collection) => (
                <AddFavoriteStyle.CollectionItem
                  key={collection.id}
                  onClick={() => handleAddToCollection(collection.id)}
                >
                  <FiHeart />
                  <span>{collection.name}</span>
                </AddFavoriteStyle.CollectionItem>
              ))}
            </AddFavoriteStyle.CollectionList>

            <AddFavoriteStyle.CreateCollectionForm>
              <input
                type="text"
                placeholder="Nombre de nueva colección"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <button onClick={handleCreateCollection} disabled={isCreatingCollection || !newCollectionName.trim()}>
                Crear
              </button>
            </AddFavoriteStyle.CreateCollectionForm>
          </AddFavoriteStyle.CollectionSelectorModal>
        </AddFavoriteStyle.CollectionSelectorOverlay>
      )}
    </>
  );
};

export default AddToFavoritesButton;
