'use client';

import PlantCharacteristics from '@/app/components/products/PlantCharacteristics';
import { HomeContentProps } from '@/app/interfaces/home.interface';
import { LoadingSpinner } from '@/app/components/shared/loading/Spinner';
import { PlantCategoriesSection } from '@/app/components/products/section/PlantCategoriesSection';
import { PlantProductsSection } from '@/app/components/products/section/PlantProductsSection';
import { FeaturedKitSection } from '@/app/components/products/features/FeaturedKitSection';
import { FeaturedProductsSection } from '@/app/components/products/features/FeaturedProductsSection';
import { ErrorMessage } from '@/app/components/shared/status/ErrorMessage';
import { AccessoryProductsSection } from '@/app/components/products/AccessoryProductsSection';
import { CategoryAccesory } from '@/app/components/filters/CategoryAccesory';

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
