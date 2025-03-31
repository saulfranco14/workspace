import { ReactNode } from 'react';

interface EmptyResultsProps {
  title: string;
  message?: string;
  icon?: ReactNode;
}

const EmptyResults: React.FC<EmptyResultsProps> = ({
  title,
  message = 'No se encontraron productos en esta categoría.',
  icon,
}) => {
  return (
    <div className="border border-gray-200 bg-gray-50 rounded-lg py-8 px-4 text-center mb-10">
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
        {icon || (
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{message}</p>
    </div>
  );
};

export default EmptyResults;
