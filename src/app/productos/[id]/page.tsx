'use client';

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiShare2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import AddToCartButton from '@/app/components/cart/AddToCartButton';
import AddToFavoritesButton from '@/app/components/favorites/AddToFavoritesButton';
import EmptyResults from '@/app/components/shared/EmptyResults';

import {
  selectProductsError,
  selectProductsLoading,
  selectSelectedProduct,
  selectProducts,
} from '@/selectors/productSelectors';
import ProductSkeleton from '@/app/components/shared/skeletons/ProductSkeleton';
import WarningIcon from '@/app/components/shared/icons/WarningIcon';
import ProductCard from '@/app/components/products/ProductCard';
import { fetchProductById } from '@/store/products/thunk/productThunk';
import { AppDispatch } from '@/store/store';
import { Product } from '@/interfaces/product.interface';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const product = useSelector(selectSelectedProduct);
  const allProducts = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProductById(params.id as string));
  }, [dispatch, params.id]);

  const relatedProducts =
    product && allProducts
      ? allProducts.filter((p: Product) => p.id !== product.id && p.category?.id === product.category?.id).slice(0, 4)
      : [];

  if (loading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <EmptyResults
        title="Producto no encontrado"
        message={error || 'El producto que buscas no existe o no está disponible.'}
        icon={<WarningIcon />}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackLink
        href="/productos"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >
        <FiArrowLeft />
        <span>Volver</span>
      </BackLink>

      <ProductContainer>
        <ImageSection>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <PlaceholderImage>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-12 h-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.25 2.25 0 0 0-1.872-1.034H9.25a2.25 2.25 0 0 0-1.872 1.034l-.822 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </PlaceholderImage>
          )}
        </ImageSection>

        <InfoSection>
          <CategoryBadge>
            <Link href={`/categoria/${product.category?.id}`}>{product.category?.name}</Link>
          </CategoryBadge>

          <ProductName>{product.name}</ProductName>

          <PriceContainer>
            <Price>${product.price}</Price>
            <StockBadge stock={product.stock}>
              {product.stock > 10 ? 'Disponible' : product.stock > 0 ? 'Pocas unidades' : 'Agotado'}
            </StockBadge>
          </PriceContainer>

          <DescriptionContainer>
            <Description $expanded={showFullDescription}>{product.description}</Description>
            {product.description && product.description.length > 120 && (
              <DescriptionToggle onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? 'Mostrar menos' : 'Leer más'}
              </DescriptionToggle>
            )}
          </DescriptionContainer>

          <ActionsContainer>
            <AddToCartButton productId={product.id} stock={product.stock} />
            <ActionButtonGroup>
              <AddToFavoritesButton productId={product.id} showText={true} size="lg" />
              <ActionButton aria-label="Compartir producto">
                <FiShare2 />
                <span className="action-text">Compartir</span>
              </ActionButton>
            </ActionButtonGroup>
          </ActionsContainer>

          {product.stock > 0 && (
            <DeliveryInfo>
              <FiShoppingBag />
              <span>Envío gratuito en pedidos superiores a $500</span>
            </DeliveryInfo>
          )}
        </InfoSection>
      </ProductContainer>

      {relatedProducts.length > 0 && (
        <RelatedProductsSection>
          <SectionTitle>Productos similares</SectionTitle>
          <RelatedProductsGrid>
            {relatedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </RelatedProductsGrid>
        </RelatedProductsSection>
      )}
    </div>
  );
}

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: var(--primary-dark);
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
  height: 350px;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    height: 500px;
  }
`;

const PlaceholderImage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ProductName = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
`;

const StockBadge = styled.div<{ stock: number }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ stock }) => (stock > 10 ? '#e8f5e9' : stock > 0 ? '#fff8e1' : '#ffebee')};
  color: ${({ stock }) => (stock > 10 ? '#388e3c' : stock > 0 ? '#ff8f00' : '#d32f2f')};
`;

const DescriptionContainer = styled.div`
  margin: 0.5rem 0;
`;

const Description = styled.p<{ $expanded: boolean }>`
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  max-height: ${(props) => (props.$expanded ? 'none' : '4.8em')};
  position: relative;
`;

const DescriptionToggle = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 500;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;

  @media (min-width: 768px) {
    align-items: center;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  .action-text {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 0.75rem 1rem;

    .action-text {
      display: inline;
    }
  }
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 0.5rem;
`;

const RelatedProductsSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;
