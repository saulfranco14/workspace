import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/interfaces/product.interface';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-12 h-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.25 2.25 0 0 0-1.872-1.034H9.25a2.25 2.25 0 0 0-1.872 1.034l-.822 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900">{product.name}</h3>

          {product.category?.name && <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>}

          <div className="mt-2 flex items-center justify-between">
            <p className="text-emerald-600 font-medium">${product.price}</p>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {product.stock > 10 ? 'Disponible' : product.stock > 0 ? 'Pocas unidades' : 'Agotado'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
