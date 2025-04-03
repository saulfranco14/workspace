import { shouldShowSection } from '@/helpers/productHelpers';
import { AccessoryProductsSectionProps } from '@/interfaces/product.interface';
import ProductSection from '@/components/products/ProductSection';

export const AccessoryProductsSection = ({
  products,
  selectedCategory,
  selectedCategoryType,
  selectedCategoryName,
}: AccessoryProductsSectionProps) => {
  if (!shouldShowSection(selectedCategory, selectedCategoryType, 'accessory')) {
    return null;
  }

  return (
    <ProductSection
      title="Equipamientos"
      products={products}
      viewMoreLink="/productos"
      categoryName={selectedCategoryType === 'accessory' && selectedCategoryName ? selectedCategoryName : undefined}
    />
  );
};
