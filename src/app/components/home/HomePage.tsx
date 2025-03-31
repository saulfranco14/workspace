'use client';

import Banner from '@/app/components/home/Banner';
import SearchBar from '@/app/components/search/SearchBar';
import CategoryTags from '@/app/components/filters/CategoryTags';
import SearchResults from '../search/SearchResults';
import Navbar from '../navigation/Navbar';
import MainContainer from '../shared/MainContainer';
import HomeContent from './HomeContent';
import { useHomeData } from '@/app/hooks/useHome';

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
      <Navbar />
      <div className="container mx-auto px-4 py-24">
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
          featuredKit={featuredKit}
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
