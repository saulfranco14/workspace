import Link from 'next/link';
import { Product } from '@/interfaces/product.interface';
import ProductCard from '@/components/products/ProductCard';
import EmptyResults from '@/components/shared/EmptyResults';

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewMoreLink?: string;
  categoryName?: string;
  showEmpty?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  viewMoreLink,
  categoryName,
  showEmpty = true,
}) => {
  if (products.length === 0 && showEmpty) {
    return (
      <EmptyResults
        title={`No hay productos en ${title}`}
        message={
          categoryName
            ? `No se encontraron productos en la categoría "${categoryName}".`
            : 'No hay productos disponibles en este momento.'
        }
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0-6.75h-3.75m3.75 0h3.75M9 12h3.75m-8.25-4.5h16.5"
            />
          </svg>
        }
      />
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>

        {viewMoreLink && (
          <Link href={viewMoreLink} className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm">
            <span>Ver más</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
