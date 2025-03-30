'use client';

import { AlertMessage } from '@/app/styles/components/AlertStyle';

type FormStatusProps = {
  error: string | null;
  success: boolean;
  successMessage: string;
};

export default function FormStatus({ error, success, successMessage }: FormStatusProps) {
  if (!error && !success) return null;

  return (
    <>
      {error && <AlertMessage type="error">{error}</AlertMessage>}
      {success && <AlertMessage type="success">{successMessage}</AlertMessage>}
    </>
  );
}
