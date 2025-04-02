import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/interfaces/product.interface';
import AddToCartButton from '@/components/cart/AddToCartButton';
import AddToFavoritesButton from '@/components/favorites/AddToFavoritesButton';
import ViewMoreButton from '@/components/cart/ViewMoreButton';
import styled from 'styled-components';

type ProductCardProps = {
  product: Product;
  inFavorites?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, inFavorites = false }) => {
  return (
    <CardContainer>
      <ImageContainer>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform hover:scale-105"
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
        {!inFavorites && (
          <FavoriteButtonWrapper>
            <AddToFavoritesButton productId={product.id} size="sm" />
          </FavoriteButtonWrapper>
        )}
      </ImageContainer>

      <ContentContainer>
        <Link href={`/productos/${product.id}`}>
          <ProductName>{product.name}</ProductName>
        </Link>
        {product.category && <CategoryName>{product.category.name}</CategoryName>}

        <ProductDetails>
          <Price>${product.price.toFixed(2)}</Price>
          <StockBadge stock={product.stock}>
            {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock bajo' : 'Agotado'}
          </StockBadge>
        </ProductDetails>

        <ButtonContainer>
          <ViewMoreButton productId={product.id} />
          {product.stock > 0 && <AddToCartButton productId={product.id} stock={product.stock} />}
        </ButtonContainer>
      </ContentContainer>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    height: 48vh;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  width: 100%;
  background-color: #f9f9f9;
`;

const FavoriteButtonWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
`;

const PlaceholderImage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

const ContentContainer = styled.div`
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 5px 0;
`;

const CategoryName = styled.p`
  font-size: 12px;
  color: #777;
  margin: 0 0 10px 0;
`;

const ProductDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Price = styled.span`
  font-weight: 600;
  color: var(--primary);
  font-size: 16px;
`;

const StockBadge = styled.div<{ stock: number }>`
  font-size: 11px;
  border-radius: 20px;
  padding: 3px 8px;
  background-color: ${({ stock }) => (stock > 10 ? '#e8f5e9' : stock > 0 ? '#fff8e1' : '#ffebee')};
  color: ${({ stock }) => (stock > 10 ? '#388e3c' : stock > 0 ? '#ff8f00' : '#d32f2f')};
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export default ProductCard;
