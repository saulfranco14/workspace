import { shouldShowSection } from '@/app/helpers/productHelpers';
import { AccessoryProductsSectionProps } from '@/app/interfaces/product.interface';
import ProductSection from '@/app/components/products/ProductSection';

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
      viewMoreLink="/products/accessories"
      categoryName={selectedCategoryType === 'accessory' && selectedCategoryName ? selectedCategoryName : undefined}
    />
  );
};
