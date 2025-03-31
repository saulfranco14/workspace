import { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store/store';
import { searchProductsThunk } from '@/app/store/products/thunk/productThunk';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProductsThunk(searchTerm));
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm mb-8">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Buscar plantas, accesorios o kits..."
          className="flex-grow py-3 px-4 rounded-l-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-r-lg"
          aria-label="Buscar"
        >
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
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
