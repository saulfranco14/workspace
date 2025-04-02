'use client';

import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { FiHeart, FiPlusCircle } from 'react-icons/fi';
import { ItemTypes } from '@/components/products/DraggableProductsList';
import { AppDispatch } from '@/store/store';
import { addToFavorites, fetchUserFavoriteCollections } from '@/store/favorites/thunk/favoritesThunk';
import { Product } from '@/interfaces/product.interface';

interface DroppableCollectionProps {
  collectionId: string;
  name: string;
  itemCount: number;
  isActive: boolean;
  onSelect: () => void;
}

const DroppableCollection: React.FC<DroppableCollectionProps> = ({
  collectionId,
  name,
  itemCount,
  isActive,
  onSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLDivElement>(null);

  // Mantener una referencia estable al ID de la colección
  const collectionIdRef = useRef(collectionId);

  // Actualizar la referencia cuando cambia el ID de la colección
  useEffect(() => {
    collectionIdRef.current = collectionId;
  }, [collectionId]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PRODUCT,
      drop: async (item: { product: Product; targetCollectionId?: string }) => {
        try {
          // Usar el ID de esta colección específica, no el targetCollectionId del item arrastrado
          // Esto asegura que se añada al lugar donde se suelta, no a la colección activa
          const targetId = collectionIdRef.current;

          console.log('Dropping to specific collection:', name, 'ID:', targetId);

          await dispatch(
            addToFavorites({
              productId: item.product.id,
              collectionId: targetId,
            })
          );

          // Recargar las colecciones para actualizar el contenido con los productos completos
          await dispatch(fetchUserFavoriteCollections());
        } catch (error) {
          // En caso de error, simplemente actualizar las colecciones para reflejar el estado actual
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
  ); // Recrear cuando cambie el ID de referencia

  // Conectar el drop al ref
  drop(ref);

  const isActive3 = isOver && canDrop;

  return (
    <CollectionItem ref={ref} onClick={onSelect} $isActive={isActive} $isDragActive={isActive3}>
      <CollectionInfo>
        <HeartIcon $isActive={isActive}>
          <FiHeart size={18} />
        </HeartIcon>
        <div>
          <CollectionName>{name}</CollectionName>
          <ItemCount>
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
          </ItemCount>
        </div>
      </CollectionInfo>

      {isActive3 && (
        <DropIndicator>
          <FiPlusCircle size={18} />
          <span>Soltar aquí</span>
        </DropIndicator>
      )}
    </CollectionItem>
  );
};

const CollectionItem = styled.div<{ $isActive: boolean; $isDragActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: ${(props) => {
    if (props.$isDragActive) return 'var(--primary-light)';
    return props.$isActive ? 'var(--primary-light)' : 'transparent';
  }};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border-left: ${(props) => (props.$isActive ? '4px solid var(--primary)' : '4px solid transparent')};
  box-shadow: ${(props) => (props.$isDragActive ? '0 0 0 2px var(--primary)' : 'none')};

  &:hover {
    background-color: ${(props) => {
      if (props.$isDragActive) return 'var(--primary-light)';
      return props.$isActive ? 'var(--primary-light)' : '#f9fafb';
    }};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CollectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

const CollectionName = styled.div`
  font-weight: 500;
  color: #1f2937;
`;

const ItemCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const DropIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default DroppableCollection;
