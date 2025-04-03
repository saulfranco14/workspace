'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/store/store';
import { fetchProducts, fetchCategories } from '@/store/products/thunk/productThunk';
import { PlantProductsSection } from '@/components/products/section/PlantProductsSection';
import { AccessoryProductsSection } from '@/components/products/AccessoryProductsSection';
import { FeaturedProductsSection } from '@/components/products/features/FeaturedProductsSection';
import { ProductsStyle } from '@/styles/components/ProductsStyle';
import PlantCharacteristics from '@/components/products/PlantCharacteristics';

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, selectedCategory, selectedCategoryType, selectedCategoryName } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsStyle.Header>
        <ProductsStyle.Title>Nuestros Productos</ProductsStyle.Title>
      </ProductsStyle.Header>

      <ProductsStyle.MainContent>
        <ProductsStyle.ProductsSection>
          <PlantProductsSection
            products={products}
            selectedCategory={selectedCategory}
            selectedCategoryType={selectedCategoryType}
            selectedCategoryName={selectedCategoryName}
          />
        </ProductsStyle.ProductsSection>
      </ProductsStyle.MainContent>

      <PlantCharacteristics />
    </div>
  );
}
