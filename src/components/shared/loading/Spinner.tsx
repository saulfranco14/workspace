export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-4"></div>
      <p className="text-lg text-gray-600 animate-pulse">Cargando, por favor espera...</p>
    </div>
  );
};
