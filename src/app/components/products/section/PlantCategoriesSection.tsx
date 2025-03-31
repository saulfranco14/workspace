import { shouldShowSection } from '@/app/helpers/productHelpers';
import CategoryFilter from '@/app/components/filters/CategoryFilter';
import { PlantCategoriesSectionProps } from '@/app/interfaces/product.interface';

export const PlantCategoriesSection = ({
  categories,
  selectedCategory,
  selectedCategoryType,
}: PlantCategoriesSectionProps) => {
  if (categories.length === 0 || !shouldShowSection(selectedCategory, selectedCategoryType, 'plant')) {
    return null;
  }

  return <CategoryFilter title="Categorías de Plantas" categories={categories} />;
};
