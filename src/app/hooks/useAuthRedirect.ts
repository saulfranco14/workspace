import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuthRedirect(
  success: boolean,
  router: ReturnType<typeof useRouter>,
  redirectPath: string = '/',
  delay: number = 2000
) {
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push(redirectPath);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [success, router, redirectPath, delay]);
}
