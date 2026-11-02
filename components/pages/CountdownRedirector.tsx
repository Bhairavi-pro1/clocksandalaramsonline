'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCountryFromTimezone } from '@/lib/timezoneToCountry';

export default function CountdownRedirector() {
  const router = useRouter();
  
  useEffect(() => {
    try {
      const countryCode = getCountryFromTimezone().toLowerCase();
      router.replace(`/countdown/${countryCode}`);
    } catch (e) {
      console.error('Failed to detect timezone country, defaulting to US:', e);
      router.replace('/countdown/us');
    }
  }, [router]);

  return null;
}
