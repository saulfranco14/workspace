import { Category } from './product.interface';
import { Product } from './product.interface';

export interface HomeContentProps {
  searchTerm: string;
  error: string | null;
  loading: boolean;
  plantCategories: Category[];
  accessoryCategories: Category[];
  filteredPlantProducts: Product[];
  filteredAccessoryProducts: Product[];
  featuredKit: Product;
  featuredProducts: Product[];
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
  selectedCategoryName: string | null | undefined;
}
