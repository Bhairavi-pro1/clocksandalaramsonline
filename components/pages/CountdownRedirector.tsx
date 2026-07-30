'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCountryFromTimezone } from '@/lib/timezoneToCountry';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-white/60 font-medium tracking-wide">Detecting your location...</p>
    </div>
  );
}
