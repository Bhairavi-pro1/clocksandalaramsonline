import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import CountdownRedirector from '@/components/pages/CountdownRedirector';

export const metadata: Metadata = {
  title: 'Holiday Countdowns',
  description: 'Precise, millisecond-accurate countdowns for all major global holidays. Sync with atomic time for reliability.',
  alternates: {
    canonical: 'https://clocksandalarmsonline.com/countdown',
  },
  openGraph: {
    title: 'Holiday Countdowns',
    description: 'Track the seconds until the next celebration with our suite of high-precision holiday countdowns.',
    type: 'website',
  }
};

export default async function HolidayCountdownIndexPage() {
  const headersList = await headers();
  const vercelCountry = headersList.get('x-vercel-ip-country');
  
  if (vercelCountry) {
    redirect(`/countdown/${vercelCountry.toLowerCase()}`);
  }
  
  // Render client-side redirector if vercel IP header is not present
  return <CountdownRedirector />;
}
