'use client';

import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function NProgressClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    nprogress.start();

    const timeout = setTimeout(() => {
      nprogress.complete();
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return <NavigationProgress color={'var(--mantine-color-secondary-2)'} />;
}
