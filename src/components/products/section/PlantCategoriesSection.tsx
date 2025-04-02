import { shouldShowSection } from '@/helpers/productHelpers';
import CategoryFilter from '@/components/filters/CategoryFilter';
import { PlantCategoriesSectionProps } from '@/interfaces/product.interface';

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
