import { useEffect } from 'react';

export default function useAuthRedirect(
  success: boolean,
  router: any,
  redirectPath: string = '/',
  delay: number = 3000
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
