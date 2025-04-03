'use client';

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
import { addToFavorites, fetchUserFavoriteCollections } from '@/store/favorites/thunk/favoritesThunk';
import { clearDuplicateError } from '@/store/favorites/slices/favoritesSlice';

import FavoriteCollections from '@/components/favorites/FavoriteCollections';
import DraggableProductsList from '@/components/products/DraggableProductsList';
import ProductCard from '@/components/products/ProductCard';
import EmptyResults from '@/components/shared/EmptyResults';
import { AppDispatch } from '@/store/store';
import { Product } from '@/interfaces/product.interface';

import {
  CloseButton,
  CollectionInfo,
  CollectionHeader,
  ContentContainer,
  DropOverlay,
  DuplicateErrorContainer,
  MainContent,
  PageHeader,
  SidebarContainer,
  StyledProductGrid,
  LoadingMessage,
} from '@/styles/components/FavoritePageStyle';

const DroppableProductGrid: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const activeCollection = useSelector(selectActiveCollection);
  const ref = useRef<HTMLDivElement>(null);
  const collectionIdRef = useRef<string | undefined>(activeCollection?.id);

  useEffect(() => {
    collectionIdRef.current = activeCollection?.id;
  }, [activeCollection]);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PRODUCT,
      drop: async (item: { product: Product; targetCollectionId?: string }) => {
        try {
          if (!collectionIdRef.current) return;

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
          console.error('Error al añadir producto a favoritos:', error);
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

  drop(ref);

  const isActive = isOver && canDrop;

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <StyledProductGrid $isDragActive={isActive}>
        {isActive && (
          <DropOverlay>
            <FiHeart size={48} />
            <span>Soltar para agregar a &quot;{activeCollection?.name}&quot;</span>
          </DropOverlay>
        )}
        {children}
      </StyledProductGrid>
    </div>
  );
};

const DuplicateNotification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const duplicateError = useSelector(selectDuplicateError);

  useEffect(() => {
    if (duplicateError) {
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
  const activeCollection = useSelector(selectActiveCollection);
  const productsInCollection = useSelector(selectActiveCollectionProducts);
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);

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

      <DuplicateNotification />
    </DndProvider>
  );
}
