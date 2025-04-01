export interface Category {
  id: string;
  name: string;
  type: 'plant' | 'accessory' | 'kit';
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id: string;
  category?: Category;
  is_featured?: boolean;
}

export interface ProductsResponse {
  data: Product[] | null;
  error: Error | null;
}

export interface CategoriesResponse {
  data: Category[] | null;
  error: Error | null;
}

export interface ProductsByCategory {
  [categoryId: string]: Product[];
}

export interface FeaturedProduct extends Product {
  category_name?: string;
}

export interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  featuredProducts: Product[];
  categories: Category[];
  plantCategories: Category[];
  accessoryCategories: Category[];
  kitCategories: Category[];
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
  selectedCategoryName: string | null;
  selectedProduct: Product | null;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

interface BaseSectionProps {
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
}

export interface PlantCategoriesSectionProps extends BaseSectionProps {
  categories: Category[];
}

export interface PlantProductsSectionProps extends BaseSectionProps {
  products: Product[];
  selectedCategoryName: string | null | undefined;
}

export interface AccessoryCategoriesSectionProps extends BaseSectionProps {
  categories: Category[];
}

export interface CategoryAccesoryProps extends BaseSectionProps {
  categories: Category[];
}

export interface AccessoryProductsSectionProps extends BaseSectionProps {
  products: Product[];
  selectedCategoryName: string | null | undefined;
}

export interface FeaturedKitSectionProps {
  kitProduct: Product;
  selectedCategory: string | null;
}

export interface FeaturedProductsSectionProps {
  products: Product[];
  selectedCategory: string | null;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductSectionProps {
  title: string;
  products: Product[];
  viewMoreLink?: string;
  categoryName?: string;
  showEmpty?: boolean;
}

export interface PlantProductsSectionProps {
  products: Product[];
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
  selectedCategoryName: string | null | undefined;
}

export interface AccessoryProductsSectionProps {
  products: Product[];
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
  selectedCategoryName: string | null | undefined;
}

export interface PlantCategoriesSectionProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
}

export interface CategoryAccesoryProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedCategoryType: 'plant' | 'accessory' | 'kit' | null;
}
