'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FiShare2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import AddToCartButton from '@/components/cart/AddToCartButton';
import AddToFavoritesButton from '@/components/favorites/AddToFavoritesButton';
import EmptyResults from '@/components/shared/EmptyResults';

import {
  selectProductsError,
  selectProductsLoading,
  selectSelectedProduct,
  selectProducts,
} from '@/selectors/productSelectors';
import ProductSkeleton from '@/components/shared/skeletons/ProductSkeleton';
import WarningIcon from '@/components/shared/icons/WarningIcon';
import ProductCard from '@/components/products/ProductCard';
import { fetchProductById } from '@/store/products/thunk/productThunk';
import { AppDispatch } from '@/store/store';
import { Product } from '@/interfaces/product.interface';
import { ProductIdStyles } from '@/styles/components/ProductIdStyle';

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const product = useSelector(selectSelectedProduct);
  const allProducts = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const productId = params.id && params.id !== '[id]' ? (params.id as string) : searchParams.get('id') || '';

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  const relatedProducts =
    product && allProducts
      ? allProducts.filter((p: Product) => p.id !== product.id && p.category?.id === product.category?.id).slice(0, 4)
      : [];

  if (loading) return <ProductSkeleton />;

  if (!productId || error || !product) {
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
      <ProductIdStyles.BackLink
        href="/productos"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >
        <FiArrowLeft />
        <span>Volver</span>
      </ProductIdStyles.BackLink>

      <ProductIdStyles.ProductContainer>
        <ProductIdStyles.ImageSection>
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
            <ProductIdStyles.PlaceholderImage>
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
            </ProductIdStyles.PlaceholderImage>
          )}
        </ProductIdStyles.ImageSection>

        <ProductIdStyles.InfoSection>
          <ProductIdStyles.CategoryBadge>
            <Link href={`/categoria/${product.category?.id}`}>{product.category?.name}</Link>
          </ProductIdStyles.CategoryBadge>

          <ProductIdStyles.ProductName>{product.name}</ProductIdStyles.ProductName>

          <ProductIdStyles.PriceContainer>
            <ProductIdStyles.Price>${product.price}</ProductIdStyles.Price>
            <ProductIdStyles.StockBadge stock={product.stock}>
              {product.stock > 10 ? 'Disponible' : product.stock > 0 ? 'Pocas unidades' : 'Agotado'}
            </ProductIdStyles.StockBadge>
          </ProductIdStyles.PriceContainer>

          <ProductIdStyles.DescriptionContainer>
            <ProductIdStyles.Description $expanded={showFullDescription}>
              {product.description}
            </ProductIdStyles.Description>
            {product.description && product.description.length > 120 && (
              <ProductIdStyles.DescriptionToggle onClick={() => setShowFullDescription(!showFullDescription)}>
                {showFullDescription ? 'Mostrar menos' : 'Leer más'}
              </ProductIdStyles.DescriptionToggle>
            )}
          </ProductIdStyles.DescriptionContainer>

          <ProductIdStyles.ActionsContainer>
            <AddToCartButton productId={product.id} stock={product.stock} />
            <ProductIdStyles.ActionButtonGroup>
              <AddToFavoritesButton productId={product.id} showText={true} size="lg" />
              <ProductIdStyles.ActionButton aria-label="Compartir producto">
                <FiShare2 />
                <span className="action-text">Compartir</span>
              </ProductIdStyles.ActionButton>
            </ProductIdStyles.ActionButtonGroup>
          </ProductIdStyles.ActionsContainer>

          {product.stock > 0 && (
            <ProductIdStyles.DeliveryInfo>
              <FiShoppingBag />
              <span>Envío gratuito en pedidos superiores a $500</span>
            </ProductIdStyles.DeliveryInfo>
          )}
        </ProductIdStyles.InfoSection>
      </ProductIdStyles.ProductContainer>

      {relatedProducts.length > 0 && (
        <ProductIdStyles.RelatedProductsSection>
          <ProductIdStyles.SectionTitle>Productos similares</ProductIdStyles.SectionTitle>
          <ProductIdStyles.RelatedProductsGrid>
            {relatedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductIdStyles.RelatedProductsGrid>
        </ProductIdStyles.RelatedProductsSection>
      )}
    </div>
  );
}
