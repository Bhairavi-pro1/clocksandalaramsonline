import { NextResponse } from 'next/server';
import { getHolidaysServer } from '@/lib/getHolidaysServer';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country')?.toUpperCase();
  const yearStr = searchParams.get('year');
  
  if (!country || !yearStr) {
    return NextResponse.json({ error: 'Missing country or year' }, { status: 400 });
  }
  
  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    return NextResponse.json({ error: 'Invalid year format' }, { status: 400 });
  }

  try {
    const holidays = await getHolidaysServer(country, year);
    return NextResponse.json({ holidays });
  } catch (error: any) {
    console.error(`Error in /api/holidays route for ${country}_${year}:`, error);
    
    // In case of error (e.g. API limits or key missing), try to serve cache if available
    try {
      const docRef = doc(db, 'holiday_cache', `${country}_${year}`);
      const cachedDoc = await getDoc(docRef);
      if (cachedDoc.exists()) {
        console.warn(`[Fallback Cache Route] Serving expired cache due to server helper failure`);
        return NextResponse.json({ holidays: cachedDoc.data().holidays, source: 'cache_fallback' });
      }
    } catch (fallbackDbError) {
      console.error('Fallback cache lookup failed in route:', fallbackDbError);
    }
    
    return NextResponse.json({ error: error.message || 'Failed to fetch holidays' }, { status: 500 });
  }
}
