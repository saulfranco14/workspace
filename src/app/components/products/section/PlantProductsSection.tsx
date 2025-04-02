import { shouldShowSection } from '@/app/helpers/productHelpers';
import { PlantProductsSectionProps } from '@/app/interfaces/product.interface';
import ProductSection from '@/app/components/products/ProductSection';

export const PlantProductsSection = ({
  products,
  selectedCategory,
  selectedCategoryType,
  selectedCategoryName,
}: PlantProductsSectionProps) => {
  if (!shouldShowSection(selectedCategory, selectedCategoryType, 'plant')) return null;

  return (
    <ProductSection
      title="Plantas"
      products={products}
      viewMoreLink="/productos/plantas"
      categoryName={selectedCategoryType === 'plant' && selectedCategoryName ? selectedCategoryName : undefined}
    />
  );
};
