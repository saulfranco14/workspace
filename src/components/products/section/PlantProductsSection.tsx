import { shouldShowSection } from '@/helpers/productHelpers';
import { PlantProductsSectionProps } from '@/interfaces/product.interface';
import ProductSection from '@/components/products/ProductSection';

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
