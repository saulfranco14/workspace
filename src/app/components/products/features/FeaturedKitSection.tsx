import PlantCareKit from '@/app/components/products/PlantCareKit';
import { FeaturedKitSectionProps } from '@/app/interfaces/product.interface';

export const FeaturedKitSection = ({ kitProduct, selectedCategory }: FeaturedKitSectionProps) => {
  if (!kitProduct || selectedCategory) return null;

  return <PlantCareKit kitProduct={kitProduct} />;
};
