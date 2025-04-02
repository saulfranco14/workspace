'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { FiSearch } from 'react-icons/fi';
import { Product } from '@/interfaces/product.interface';
import { fetchProducts } from '@/store/products/thunk/productThunk';
import { AppDispatch } from '@/store/store';
import { selectAllProducts, selectProductsLoading, selectProductsError } from '@/selectors/productSelectors';
import { selectActiveCollection } from '@/selectors/favoriteSelectors';

// Definiendo item types para DnD
export const ItemTypes = {
  PRODUCT: 'product',
};

// Componente para un producto individual que puede ser arrastrado
const DraggableProduct: React.FC<{ product: Product }> = ({ product }) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeCollection = useSelector(selectActiveCollection);

  // Usar una referencia para mantener el id de la colección activa para el objeto arrastrado
  const collectionIdRef = useRef<string | undefined>(activeCollection?.id);

  // Actualizar la referencia cuando cambia la colección activa
  useEffect(() => {
    collectionIdRef.current = activeCollection?.id;
  }, [activeCollection]);

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: ItemTypes.PRODUCT,
      item: () => ({
        product,
        targetCollectionId: collectionIdRef.current, // Usar la referencia actual
      }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [product, collectionIdRef.current]
  ); // Re-crear cuando cambia la colección activa

  // Conectar el drag al ref
  drag(ref);

  return (
    <ProductItem ref={ref} $isDragging={isDragging}>
      <ProductImage>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
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
      </ProductImage>
      <ProductName>{product.name}</ProductName>
      <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
    </ProductItem>
  );
};

const DraggableProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current;

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  if (loading && products.length === 0) {
    return <LoadingIndicator>Cargando productos...</LoadingIndicator>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <ProductsListContainer>
      <ListHeader>
        <h3>Arrastra productos a tus colecciones favoritas</h3>
        <SearchBox>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </ListHeader>

      <ScrollContainer>
        <ScrollButton onClick={() => handleScroll('left')}>‹</ScrollButton>
        <ProductsScrollContainer ref={scrollContainerRef}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <DraggableProduct key={product.id} product={product} />)
          ) : (
            <EmptyResultsMessage>
              {searchTerm ? 'No se encontraron productos con ese nombre' : 'No hay productos disponibles'}
            </EmptyResultsMessage>
          )}
        </ProductsScrollContainer>
        <ScrollButton onClick={() => handleScroll('right')}>›</ScrollButton>
      </ScrollContainer>
    </ProductsListContainer>
  );
};

const ProductsListContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 58vw;

  @media (max-width: 768px) {
    width: 92vw;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ScrollButton = styled.button`
  background-color: var(--primary-light);
  color: var(--primary);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e6f7ff;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const ProductsScrollContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const ProductItem = styled.div<{ $isDragging: boolean }>`
  width: 180px;
  flex-shrink: 0;
  background-color: ${(props) => (props.$isDragging ? '#f3f4f6' : 'white')};
  border: 1px solid ${(props) => (props.$isDragging ? 'var(--primary)' : '#e5e7eb')};
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: grab;
  opacity: ${(props) => (props.$isDragging ? 0.6 : 1)};
  box-shadow: ${(props) => (props.$isDragging ? '0 5px 10px rgba(0, 0, 0, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.05)')};
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-light);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: #f9fafb;
  margin-bottom: 0.5rem;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
`;

const ProductName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
`;

const LoadingIndicator = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EmptyResultsMessage = styled.div`
  width: 100%;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
`;

export default DraggableProductsList;
