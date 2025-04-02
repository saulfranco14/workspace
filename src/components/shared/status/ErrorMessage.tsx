type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">Error: {message}</div>;
};
