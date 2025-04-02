import Image from 'next/image';
import Link from 'next/link';

export const Banner = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-emerald-50 rounded-lg overflow-hidden mb-8 ">
      <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 z-1">
        <h1 className="text-2xl md:text-4xl font-semibold text-emerald-900 mb-2">Iluminando tu espacio</h1>
        <p className="text-sm md:text-base text-emerald-800 mb-4 md:mb-6 max-w-lg">
          Descubre nuestra colección de plantas y accesorios para transformar tu espacio y conectar con la naturaleza.
        </p>
        <Link
          href="/productos"
          className="bg-emerald-600 hover:bg-emerald-700 transition-colors text-white py-2 px-4 md:px-6 rounded-full inline-flex items-center w-fit text-sm md:text-base"
        >
          <span className="text-white">Ver nuevos productos</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 md:w-5 md:h-5 ml-2 text-white"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Decorative images */}
      <div className="absolute right-0 bottom-0 h-full w-2/3 md:w-1/3 opacity-70 md:opacity-80">
        <div className="relative h-full w-full">
          <Image
            src="/homepage/banner_1.jpg"
            alt="Plantas decorativas"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center right' }}
            priority
            sizes="(max-width: 768px) 66vw, 33vw"
          />
        </div>
      </div>

      {/* Overlay para mejorar legibilidad del texto en móvil */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-transparent md:hidden"></div>
    </div>
  );
};

export default Banner;
