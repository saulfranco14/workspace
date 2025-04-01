'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter } from 'react-icons/fi';

import { RootState } from '@/app/store/store';
import { fetchProducts, fetchCategories } from '@/app/store/products/thunk/productThunk';
import { PlantProductsSection } from '@/app/components/products/section/PlantProductsSection';
import { AccessoryProductsSection } from '@/app/components/products/AccessoryProductsSection';
import { FeaturedProductsSection } from '@/app/components/products/features/FeaturedProductsSection';
import { PlantCategoriesSection } from '@/app/components/products/section/PlantCategoriesSection';
import { CategoryAccesory } from '@/app/components/filters/CategoryAccesory';
import styled from 'styled-components';
import { setSearchTerm } from '../store/products/slices/productsSlice';
import { setSelectedCategory } from '../store/products/slices/productsSlice';
import PlantCharacteristics from '../components/products/PlantCharacteristics';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, categories, selectedCategory, selectedCategoryType, selectedCategoryName } = useSelector(
    (state: RootState) => state.products
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts() as any);
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  const handleCategorySelect = (categoryId: string | null) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  return (
    <Container>
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
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

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

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
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
