import { Suspense } from 'react';
import HomePage from '@/app/components/home/HomePage';

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomePage />
    </Suspense>
  );
}
