'use client';

import Banner from '@/components/home/Banner';
import SearchBar from '@/components/search/SearchBar';
import CategoryTags from '@/components/filters/CategoryTags';
import SearchResults from '../search/SearchResults';
import MainContainer from '../shared/MainContainer';
import HomeContent from './HomeContent';
import { useHomeData } from '@/hooks/useHome';
import { Product } from '@/interfaces/product.interface';

const HomePage = () => {
  const {
    searchTerm,
    error,
    loading,
    plantCategories,
    accessoryCategories,
    filteredPlantProducts,
    filteredAccessoryProducts,
    featuredKit,
    featuredProducts,
    selectedCategory,
    selectedCategoryType,
    selectedCategoryName,
  } = useHomeData();

  return (
    <MainContainer>
      <div className="container mx-auto px-4 py-8">
        <Banner />
        <SearchBar />
        <CategoryTags />
        <SearchResults />

        <HomeContent
          searchTerm={searchTerm}
          error={error}
          loading={loading}
          plantCategories={plantCategories}
          accessoryCategories={accessoryCategories}
          filteredPlantProducts={filteredPlantProducts}
          filteredAccessoryProducts={filteredAccessoryProducts}
          featuredKit={featuredKit as Product}
          featuredProducts={featuredProducts}
          selectedCategory={selectedCategory}
          selectedCategoryType={selectedCategoryType}
          selectedCategoryName={selectedCategoryName}
        />
      </div>
    </MainContainer>
  );
};

export default HomePage;
