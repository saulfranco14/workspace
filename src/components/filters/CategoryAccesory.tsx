import { shouldShowSection } from '@/helpers/productHelpers';
import { CategoryAccesoryProps } from '@/interfaces/product.interface';
import CategoryFilter from '@/components/filters/CategoryFilter';

export const CategoryAccesory = ({ categories, selectedCategory, selectedCategoryType }: CategoryAccesoryProps) => {
  if (categories.length === 0 || !shouldShowSection(selectedCategory, selectedCategoryType, 'accessory')) return null;

  return <CategoryFilter title="Accesorios para Plantas" categories={categories} />;
};
