'use client';

import PlantCharacteristics from '@/components/products/PlantCharacteristics';
import { HomeContentProps } from '@/interfaces/home.interface';
import { LoadingSpinner } from '@/components/shared/loading/Spinner';
import { PlantCategoriesSection } from '@/components/products/section/PlantCategoriesSection';
import { PlantProductsSection } from '@/components/products/section/PlantProductsSection';
import { FeaturedKitSection } from '@/components/products/features/FeaturedKitSection';
import { FeaturedProductsSection } from '@/components/products/features/FeaturedProductsSection';
import { ErrorMessage } from '@/components/shared/status/ErrorMessage';
import { AccessoryProductsSection } from '@/components/products/AccessoryProductsSection';
import { CategoryAccesory } from '@/components/filters/CategoryAccesory';

const HomeContent = ({
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
}: HomeContentProps) => {
  if (searchTerm) return null;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <PlantCharacteristics />

      <PlantCategoriesSection
        categories={plantCategories}
        selectedCategory={selectedCategory}
        selectedCategoryType={selectedCategoryType}
      />

      <PlantProductsSection
        products={filteredPlantProducts}
        selectedCategory={selectedCategory}
        selectedCategoryType={selectedCategoryType}
        selectedCategoryName={selectedCategoryName}
      />

      <CategoryAccesory
        categories={accessoryCategories}
        selectedCategory={selectedCategory}
        selectedCategoryType={selectedCategoryType}
      />

      <AccessoryProductsSection
        products={filteredAccessoryProducts}
        selectedCategory={selectedCategory}
        selectedCategoryType={selectedCategoryType}
        selectedCategoryName={selectedCategoryName}
      />

      <FeaturedKitSection kitProduct={featuredKit} selectedCategory={selectedCategory} />

      <FeaturedProductsSection products={featuredProducts} selectedCategory={selectedCategory} />
    </>
  );
};

export default HomeContent;
