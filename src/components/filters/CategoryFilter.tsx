import { useDispatch, useSelector } from 'react-redux';
import { Category } from '@/interfaces/product.interface';
import { setSelectedCategory } from '@/store/products/slices/productsSlice';
import { RootState } from '@/store/store';

const CategoryFilter: React.FC<{
  title: string;
  categories: Category[];
}> = ({ title, categories }) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state: RootState) => state.products.selectedCategory);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(categoryId));
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
