'use client';

import { useRef, useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { FiHeart, FiPlusCircle } from 'react-icons/fi';

import { ItemTypes } from '@/components/products/DraggableProductsList';
import { AppDispatch } from '@/store/store';
import { addToFavorites, fetchUserFavoriteCollections } from '@/store/favorites/thunk/favoritesThunk';
import { Product } from '@/interfaces/product.interface';
import { DroppableCollectionProps } from '@/interfaces/dragDrop.interface';
import { DroppableCollectionStyles } from '@/styles/components/DroppableCollectionStyles';

const DroppableCollection: FC<DroppableCollectionProps> = ({ collectionId, name, itemCount, isActive, onSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);
  const collectionIdRef = useRef(collectionId);

  useEffect(() => {
    collectionIdRef.current = collectionId;
  }, [collectionId]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PRODUCT,
      drop: async (item: { product: Product; targetCollectionId?: string }) => {
        try {
          const targetId = collectionIdRef.current;

          await dispatch(
            addToFavorites({
              productId: item.product.id,
              collectionId: targetId,
            })
          );

          setTimeout(async () => {
            await dispatch(fetchUserFavoriteCollections());
          }, 500);
        } catch (error) {
          console.error('Error al añadir a favoritos:', error);
          await dispatch(fetchUserFavoriteCollections());
        }

        return { collectionId: collectionIdRef.current };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [collectionIdRef.current]
  );

  drop(ref);

  const isActive3 = isOver && canDrop;

  return (
    <DroppableCollectionStyles.CollectionItem
      ref={ref}
      onClick={onSelect}
      $isActive={isActive}
      $isDragActive={isActive3}
    >
      <DroppableCollectionStyles.CollectionInfo>
        <DroppableCollectionStyles.HeartIcon $isActive={isActive}>
          <FiHeart size={18} />
        </DroppableCollectionStyles.HeartIcon>
        <div>
          <DroppableCollectionStyles.CollectionName>{name}</DroppableCollectionStyles.CollectionName>
          <DroppableCollectionStyles.ItemCount>
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
          </DroppableCollectionStyles.ItemCount>
        </div>
      </DroppableCollectionStyles.CollectionInfo>

      {isActive3 && (
        <DroppableCollectionStyles.DropIndicator>
          <FiPlusCircle size={18} />
          <span>Soltar aquí</span>
        </DroppableCollectionStyles.DropIndicator>
      )}
    </DroppableCollectionStyles.CollectionItem>
  );
};

export default DroppableCollection;
