import { useState, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';
import { searchProductsThunk } from '@/app/store/products/thunk/productThunk';
import { setSelectedCategory, clearFilters } from '@/app/store/products/slices/productsSlice';

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCategory, categories, loading, searchTerm } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (searchTerm && !inputValue) {
      setInputValue(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(searchProductsThunk(inputValue.trim()));
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(categoryId));
    }
    setDropdownOpen(false);
  };

  const handleClearSearch = () => {
    setInputValue('');
    dispatch(clearFilters());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const selectedCategoryName = selectedCategory ? categories.find((cat) => cat.id === selectedCategory)?.name : null;

  return (
    <div className="my-8">
      <div className="flex justify-center items-center gap-2 w-full max-w-4xl mx-auto">
        <div className="flex-grow max-w-2xl relative">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar plantas, accesorios o kits..."
              className="w-full py-3 px-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-600 bg-white"
              value={inputValue}
              onChange={handleInputChange}
              autoComplete="off"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className={`absolute right-0 top-0 h-full px-4 ${
                !inputValue.trim() ? 'text-gray-400' : 'text-emerald-600 hover:text-emerald-700'
              }`}
              disabled={!inputValue.trim() || loading}
              aria-label="Buscar"
            >
              {loading ? (
                <div className="w-5 h-5 border-t-2 border-emerald-600 rounded-full animate-spin"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              )}
            </button>
          </form>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`py-3 px-5 rounded-lg flex items-center gap-2 text-sm transition-colors ${
              selectedCategory
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{selectedCategoryName || 'Categorías'}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {dropdownOpen && categories.length > 0 && (
            <div className="absolute z-10 right-0 mt-1 py-2 w-56 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-100">
              <button
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  dispatch(setSelectedCategory(null));
                  setDropdownOpen(false);
                }}
              >
                Todas las categorías
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-4 py-2 text-sm w-full text-left flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {selectedCategory === category.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                  <span className={selectedCategory === category.id ? 'ml-2' : 'ml-6'}>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
