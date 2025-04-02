import ProductSection from '@/app/components/products/ProductSection';
import { FeaturedProductsSectionProps } from '@/interfaces/product.interface';

export const FeaturedProductsSection = ({ products, selectedCategory }: FeaturedProductsSectionProps) => {
  if (selectedCategory || products.length === 0) {
    return null;
  }

  return (
    <ProductSection title="Destacados" products={products} viewMoreLink="/productos/destacados" showEmpty={false} />
  );
};
