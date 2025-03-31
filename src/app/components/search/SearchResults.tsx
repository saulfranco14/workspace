import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import ProductCard from '@/app/components/products/ProductCard';
import PlantCareKit from '@/app/components/products/PlantCareKit';

const SearchResults = () => {
  const { searchTerm, filteredProducts, loading, error, selectedCategory, categories } = useSelector(
    (state: RootState) => state.products
  );

  const selectedCategoryName = selectedCategory ? categories.find((cat) => cat.id === selectedCategory)?.name : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 shadow-sm">
        <p className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          Error: {error}
        </p>
      </div>
    );
  }

  // Si no hay búsqueda ni categoría seleccionada, no mostrar nada
  if (!searchTerm && !selectedCategory) {
    return null;
  }

  // Si hay una categoría seleccionada pero no hay búsqueda activa,
  // la interfaz de usuario muestra los productos filtrados en otra parte
  if (!searchTerm && selectedCategory) {
    return null;
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg mb-8 shadow-sm border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto text-gray-400 mb-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          No se encontraron resultados
          {searchTerm && ` para ${'"'}${searchTerm}${'"'}`}
          {selectedCategoryName && ` en la categoría ${'"'}${selectedCategoryName}${'"'}`}
        </h3>
        <p className="text-gray-600">Intenta con otra búsqueda o explora nuestras categorías</p>
      </div>
    );
  }

  if (filteredProducts.length === 1) {
    return (
      <div className="mb-10">
        <div className="mb-4 pb-3 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 text-emerald-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
              />
            </svg>
            Resultado:
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategoryName && ` en ${selectedCategoryName}`}
          </h2>
        </div>
        <PlantCareKit kitProduct={filteredProducts[0]} />
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="mb-5 pb-3 border-b border-gray-100">
        <h2 className="text-xl font-medium text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-emerald-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
          <span className="mr-1">{filteredProducts.length} resultados</span>
          {searchTerm && <span className="font-normal text-gray-600">para {`"${searchTerm}"`}</span>}
          {selectedCategoryName && <span className="font-normal text-gray-600 ml-1">en {selectedCategoryName}</span>}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
