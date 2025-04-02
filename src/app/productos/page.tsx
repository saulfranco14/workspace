'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch, RootState } from '@/app/store/store';
import { fetchProducts, fetchCategories } from '@/app/store/products/thunk/productThunk';
import { PlantProductsSection } from '@/app/components/products/section/PlantProductsSection';
import { AccessoryProductsSection } from '@/app/components/products/AccessoryProductsSection';
import { FeaturedProductsSection } from '@/app/components/products/features/FeaturedProductsSection';
import { setSelectedCategory } from '@/app/store/products/slices/productsSlice';
import PlantCharacteristics from '@/app/components/products/PlantCharacteristics';

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, selectedCategory, selectedCategoryType, selectedCategoryName } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategorySelect = (categoryId: string | null) => {
    dispatch(setSelectedCategory(categoryId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header>
        <Title>Nuestros Productos</Title>
      </Header>

      <MainContent>
        <ProductsSection>
          <FeaturedProductsSection products={products} selectedCategory={selectedCategory} />
          <PlantProductsSection
            products={products}
            selectedCategory={selectedCategory}
            selectedCategoryType={selectedCategoryType}
            selectedCategoryName={selectedCategoryName}
          />
          <AccessoryProductsSection
            products={products}
            selectedCategory={selectedCategory}
            selectedCategoryType={selectedCategoryType}
            selectedCategoryName={selectedCategoryName}
          />
        </ProductsSection>
      </MainContent>

      <PlantCharacteristics />
    </div>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const MainContent = styled.div`
  display: grid;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSection = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  height: fit-content;

  @media (max-width: 768px) {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    overflow-y: auto;

    &.open {
      display: block;
    }
  }
`;

const ProductsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
