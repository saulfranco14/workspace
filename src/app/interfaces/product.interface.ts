export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
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
  productsByCategory: ProductsByCategory;
  featuredProducts: Product[];
  categories: Category[];
  plantCategories: Category[];
  accessoryCategories: Category[];
  kitCategories: Category[];
  selectedCategory: string | null;
  searchTerm: string;
  loading: boolean;
  error: string | null;
}
