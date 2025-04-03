import { PlantProductsSectionProps } from '@/interfaces/product.interface';
import ProductSection from '@/components/products/ProductSection';

export const PlantProductsSection = ({
  products,
  selectedCategoryType,
  selectedCategoryName,
}: PlantProductsSectionProps) => {
  return (
    <ProductSection
      title="Plantas"
      products={products}
      viewMoreLink="/productos"
      categoryName={selectedCategoryType === 'plant' && selectedCategoryName ? selectedCategoryName : undefined}
    />
  );
};
