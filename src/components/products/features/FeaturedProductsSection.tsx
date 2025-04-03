import ProductSection from '@/components/products/ProductSection';
import { FeaturedProductsSectionProps } from '@/interfaces/product.interface';

export const FeaturedProductsSection = ({ products, selectedCategory }: FeaturedProductsSectionProps) => {
  if (selectedCategory || products.length === 0) {
    return null;
  }

  return <ProductSection title="Destacados" products={products} viewMoreLink="/productos" showEmpty={false} />;
};
