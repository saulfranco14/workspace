'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiHeart } from 'react-icons/fi';
import { AppDispatch } from '@/app/store/store';
import { fetchUserFavoriteCollections } from '@/app/store/favorites/thunk/favoritesThunk';
import {
  selectActiveCollection,
  selectActiveCollectionProducts,
  selectFavoritesLoading,
  selectFavoritesError,
} from '@/app/selectors/favoriteSelectors';

import FavoriteCollections from '@/app/components/favorites/FavoriteCollections';
import ProductCard from '@/app/components/products/ProductCard';
import EmptyResults from '@/app/components/shared/EmptyResults';

export default function FavoritosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const activeCollection = useSelector(selectActiveCollection);
  const productsInCollection = useSelector(selectActiveCollectionProducts);
  const loading = useSelector(selectFavoritesLoading);
  const error = useSelector(selectFavoritesError);

  useEffect(() => {
    dispatch(fetchUserFavoriteCollections());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader>
        <h1>Mis Favoritos</h1>
      </PageHeader>

      <ContentContainer>
        <SidebarContainer>
          <FavoriteCollections />
        </SidebarContainer>

        <MainContent>
          {activeCollection && (
            <CollectionHeader>
              <h2>{activeCollection.name}</h2>
              <CollectionInfo>
                {activeCollection.items?.length || 0} {activeCollection.items?.length === 1 ? 'producto' : 'productos'}
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
              message="Agrega productos a esta colección desde las páginas de productos"
              icon={<FiHeart size={48} />}
            />
          ) : (
            <ProductGrid>
              {productsInCollection.map((product) => product && <ProductCard key={product.id} product={product} />)}
            </ProductGrid>
          )}
        </MainContent>
      </ContentContainer>
    </div>
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

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
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
