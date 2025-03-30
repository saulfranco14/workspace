import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="grid place-items-center min-h-screen p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
        <p className="mb-6">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <Link
          href="/"
          className="mt-3 block w-full rounded-md bg-default px-3 py-2 text-center text-sm font-semibold text-white"
          role="button"
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
}
