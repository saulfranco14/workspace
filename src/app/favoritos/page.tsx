'use client';

import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FiHeart, FiInfo, FiX } from 'react-icons/fi';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import { useRef, useEffect } from 'react';

import {
  selectActiveCollection,
  selectActiveCollectionProducts,
  selectFavoritesLoading,
  selectFavoritesError,
  selectDuplicateError,
} from '@/selectors/favoriteSelectors';
import { ItemTypes } from '@/components/products/DraggableProductsList';
import {
  addToFavorites,
  fetchUserFavoriteCollections,
  removeFromFavorites,
} from '@/store/favorites/thunk/favoritesThunk';
import { clearDuplicateError } from '@/store/favorites/slices/favoritesSlice';

import FavoriteCollections from '@/components/favorites/FavoriteCollections';
import DraggableProductsList from '@/components/products/DraggableProductsList';
import ProductCard from '@/components/products/ProductCard';
import EmptyResults from '@/components/shared/EmptyResults';
import { AppDispatch } from '@/store/store';
import { Product } from '@/interfaces/product.interface';
import { FavoriteCollection } from '@/interfaces/favorites.interface';

// Componente para recibir productos arrastrados en el grid
const DroppableProductGrid: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeCollection = useSelector(selectActiveCollection);
  const ref = useRef<HTMLDivElement>(null);

  // Solo proceder si hay una colección activa
  const collectionIdRef = useRef<string | undefined>(activeCollection?.id);

  // Mantener actualizada la referencia al ID de la colección
  useEffect(() => {
    collectionIdRef.current = activeCollection?.id;
  }, [activeCollection]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PRODUCT,
      drop: async (item: { product: Product; targetCollectionId?: string }) => {
        try {
          // Asegurarse de que hay una colección activa
          if (!collectionIdRef.current) return;

          const targetId = collectionIdRef.current;

          console.log('Dropping to grid of collection:', activeCollection?.name, 'ID:', targetId);

          // Agregar el producto a favoritos
          await dispatch(
            addToFavorites({
              productId: item.product.id,
              collectionId: targetId,
            })
          );

          // Esperar un momento y luego forzar una actualización de las colecciones
          // para asegurar que los cambios se reflejen en la interfaz
          setTimeout(async () => {
            await dispatch(fetchUserFavoriteCollections());
          }, 500);
        } catch (error) {
          console.error('Error al añadir producto a favoritos:', error);
          // En caso de error, intentar actualizar las colecciones de todos modos
          dispatch(fetchUserFavoriteCollections());
        }
      },
      canDrop: () => !!collectionIdRef.current,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [collectionIdRef.current]
  );

  // Conectar el drop al ref
  drop(ref);

  const isActive = isOver && canDrop;

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <StyledProductGrid $isDragActive={isActive}>
        {isActive && (
          <DropOverlay>
            <FiHeart size={48} />
            <span>Soltar para agregar a "{activeCollection?.name}"</span>
          </DropOverlay>
        )}
        {children}
      </StyledProductGrid>
    </div>
  );
};

// Componente para mostrar notificaciones
const DuplicateNotification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const duplicateError = useSelector(selectDuplicateError);

  useEffect(() => {
    if (duplicateError) {
      // Limpiar el error después de 3 segundos
      const timer = setTimeout(() => {
        dispatch(clearDuplicateError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [duplicateError, dispatch]);

  if (!duplicateError) return null;

  return (
    <DuplicateErrorContainer>
      <div>
        <FiInfo size={20} />
        <span>{duplicateError}</span>
      </div>
      <CloseButton onClick={() => dispatch(clearDuplicateError())}>
        <FiX size={18} />
      </CloseButton>
    </DuplicateErrorContainer>
  );
};

export default function FavoritosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const activeCollection = useSelector(selectActiveCollection);
  const productsInCollection = useSelector(selectActiveCollectionProducts);
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);

  const handleRemoveFromFavorites = (itemId: string, collectionId: string) => {
    dispatch(removeFromFavorites({ itemId, collectionId }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <PageHeader>
          <h1>Mis Favoritos</h1>
        </PageHeader>

        <ContentContainer>
          <SidebarContainer>
            <FavoriteCollections />
          </SidebarContainer>

          <MainContent>
            <DraggableProductsList />
            {activeCollection && (
              <CollectionHeader>
                <h2>{activeCollection.name}</h2>
                <CollectionInfo>
                  {activeCollection.items?.length || 0}{' '}
                  {activeCollection.items?.length === 1 ? 'producto' : 'productos'}
                </CollectionInfo>
              </CollectionHeader>
            )}

            {loading && !productsInCollection.length ? (
              <LoadingMessage>Cargando productos...</LoadingMessage>
            ) : error ? (
              <EmptyResults title="Error al cargar favoritos" message={error} icon={<FiHeart size={48} />} />
            ) : !activeCollection ? (
              <EmptyResults
                title="Selecciona una colección"
                message="Selecciona una colección de favoritos para ver sus productos"
                icon={<FiHeart size={48} />}
              />
            ) : productsInCollection.length === 0 ? (
              <EmptyResults
                title="No hay productos en esta colección"
                message="Arrastra productos desde arriba a esta colección para agregarlos a favoritos"
                icon={<FiHeart size={48} />}
              />
            ) : (
              <DroppableProductGrid>
                {productsInCollection.map(
                  (product) => product && <ProductCard key={product.id} product={product} inFavorites={true} />
                )}
              </DroppableProductGrid>
            )}
          </MainContent>
        </ContentContainer>
      </div>

      {/* Notificación de productos duplicados */}
      <DuplicateNotification />
    </DndProvider>
  );
}

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 350px 1fr;
  }
`;

const SidebarContainer = styled.div`
  @media (max-width: 767px) {
    order: 2;
  }
`;

const MainContent = styled.div`
  @media (max-width: 767px) {
    order: 1;
  }
`;

const CollectionHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
`;

const CollectionInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StyledProductGrid = styled.div<{ $isDragActive?: boolean }>`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  position: relative;
  min-height: 200px;
  border: ${(props) => (props.$isDragActive ? '2px dashed var(--primary)' : 'none')};
  border-radius: 0.5rem;
  padding: ${(props) => (props.$isDragActive ? '1rem' : '0')};
  background-color: ${(props) => (props.$isDragActive ? 'var(--primary-light)' : 'transparent')};
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

const DropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.85);
  z-index: 10;
  color: var(--primary);

  svg {
    margin-bottom: 1rem;
    animation: pulse 1.5s infinite;
  }

  span {
    font-size: 1.125rem;
    font-weight: 500;
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

const LoadingMessage = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DuplicateErrorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff8e1;
  border: 1px solid #ffcc80;
  color: #f57c00;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  max-width: 350px;
  animation: slideIn 0.3s ease-out;

  div {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #f57c00;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(245, 124, 0, 0.1);
  }
`;
