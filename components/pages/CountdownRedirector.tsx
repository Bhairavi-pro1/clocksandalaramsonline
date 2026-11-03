'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCountryFromTimezone } from '@/lib/timezoneToCountry';
import { getCountrySlug } from '@/lib/countryResolver';

export default function CountdownRedirector() {
  const router = useRouter();
  
  useEffect(() => {
    try {
      const countryCode = getCountryFromTimezone().toLowerCase();
      const countrySlug = getCountrySlug(countryCode) || 'united-states';
      router.replace(`/countdown/${countrySlug}`);
    } catch (e) {
      console.error('Failed to detect timezone country, defaulting to US:', e);
      router.replace('/countdown/united-states');
    }
  }, [router]);

  return null;
}
