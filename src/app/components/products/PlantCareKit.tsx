import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/app/interfaces/product.interface';

type PlantCareKitProps = {
  kitProduct?: Product;
};

const PlantCareKit: React.FC<PlantCareKitProps> = ({ kitProduct }) => {
  if (!kitProduct) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Planta Care Kit (nuevo)</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-xl font-medium text-gray-800 mb-2">{kitProduct.name}</h3>
          <p className="text-gray-600 mb-3 text-sm">{kitProduct.description}</p>

          <p className="text-emerald-600 font-medium text-lg mb-4">${kitProduct.price}</p>

          <Link
            href={`/productos/${kitProduct.id}`}
            className="inline-block bg-emerald-600 py-2 px-6 rounded-lg transition-colors"
          >
            <span className="text-white">Ver detalles</span>
          </Link>
        </div>

        <div className="md:w-1/2 relative h-[200px] md:h-[300px]">
          {kitProduct.image_url ? (
            <Image
              src={kitProduct.image_url}
              alt={kitProduct.name}
              fill
              style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCareKit;
