import Link from 'next/link';
import { Product } from '@/app/interfaces/product.interface';
import ProductCard from '@/app/components/products/ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewMoreLink?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, viewMoreLink }) => {
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
