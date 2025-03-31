'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/app/store/store';

import Banner from '@/app/components/home/Banner';
import SearchBar from '@/app/components/search/SearchBar';
import CategoryFilter from '@/app/components/filters/CategoryFilter';
import ProductSection from '@/app/components/products/ProductSection';
import PlantCharacteristics from '@/app/components/products/PlantCharacteristics';
import PlantCareKit from '@/app/components/products/PlantCareKit';
import Navbar from '../navigation/Navbar';
import {
  fetchCategories,
  fetchCategoriesByType,
  fetchFeaturedProducts,
  fetchProducts,
} from '@/app/store/products/thunk/productThunk';
import MainContainer from '../shared/MainContainer';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    plantCategories,
    accessoryCategories,
    kitCategories,
    products,
    filteredProducts,
    featuredProducts,
    selectedCategory,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchCategoriesByType());
    dispatch(fetchProducts());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const getProductsByCategory = (categoryType: 'plant' | 'accessory' | 'kit') => {
    if (loading || !products.length) return [];

    const categoryIds =
      categoryType === 'plant'
        ? plantCategories.map((cat) => cat.id)
        : categoryType === 'accessory'
          ? accessoryCategories.map((cat) => cat.id)
          : kitCategories.map((cat) => cat.id);

    return products.filter((product) => product.category_id && categoryIds.includes(product.category_id));
  };

  const plantProducts = getProductsByCategory('plant');
  const accessoryProducts = getProductsByCategory('accessory');
  const kitProducts = getProductsByCategory('kit');

  const featuredKit = kitProducts.find((product) => product.is_featured);

  return (
    <MainContainer>
      {' '}
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <Banner />

        <SearchBar />

        <PlantCharacteristics />

        {plantCategories.length > 0 && <CategoryFilter title="Categorías de Plantas" categories={plantCategories} />}

        {plantProducts.length > 0 && (
          <ProductSection
            title="Plantas"
            products={selectedCategory ? filteredProducts : plantProducts}
            viewMoreLink="/products/plants"
          />
        )}

        {accessoryCategories.length > 0 && (
          <CategoryFilter title="Accesorios para Plantas" categories={accessoryCategories} />
        )}

        {accessoryProducts.length > 0 && (
          <ProductSection
            title="Equipamientos"
            products={selectedCategory ? filteredProducts : accessoryProducts}
            viewMoreLink="/products/accessories"
          />
        )}

        {featuredKit && <PlantCareKit kitProduct={featuredKit} />}

        {!selectedCategory && featuredProducts.length > 0 && (
          <ProductSection title="Destacados" products={featuredProducts} viewMoreLink="/products/featured" />
        )}

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">Error: {error}</div>}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default HomePage;
