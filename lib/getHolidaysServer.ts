import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface FormattedHoliday {
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: string[];
}

export async function getHolidaysServer(country: string, year: number): Promise<FormattedHoliday[]> {
  const normCountry = country.toUpperCase();
  const docId = `${normCountry}_${year}`;
  const docRef = doc(db, 'holiday_cache', docId);

  // 1. Try reading from Firestore cache
  try {
    const cachedDoc = await getDoc(docRef);
    if (cachedDoc.exists()) {
      const cachedData = cachedDoc.data();
      const lastUpdated = new Date(cachedData.lastUpdated).getTime();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      
      if (Date.now() - lastUpdated < thirtyDaysInMs) {
        console.log(`[Server Helper Cache Hit] Served ${normCountry}_${year} from Firestore`);
        return cachedData.holidays;
      }
      console.log(`[Server Helper Cache Expired] ${normCountry}_${year} is older than 30 days`);
    }
  } catch (err) {
    console.error('Firestore cache read error in getHolidaysServer:', err);
  }

  // 2. Fetch from Calendarific API
  const apiKey = process.env.CALENDARIFIC_API_KEY;
  if (!apiKey) {
    console.error('CALENDARIFIC_API_KEY environment variable is not defined');
    throw new Error('Server is missing configuration for Calendarific API');
  }

  const calendarificUrl = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${normCountry}&year=${year}`;
  const apiRes = await fetch(calendarificUrl);
  
  if (!apiRes.ok) {
    throw new Error(`Calendarific API responded with status ${apiRes.status}`);
  }

  const data = await apiRes.json();
  
  if (data.meta?.code !== 200 || !data.response?.holidays) {
    throw new Error(data.meta?.error_detail || 'Invalid response from Calendarific');
  }

  const formattedHolidays: FormattedHoliday[] = data.response.holidays.map((h: any) => ({
    name: h.name,
    description: h.description || '',
    date: h.date.iso || `${h.date.datetime.year}-${String(h.date.datetime.month).padStart(2, '0')}-${String(h.date.datetime.day).padStart(2, '0')}`,
    type: Array.isArray(h.type) ? h.type : [h.type || 'observance']
  }));

  // 3. Cache to Firestore asynchronously
  try {
    await setDoc(docRef, {
      country: normCountry,
      year,
      lastUpdated: new Date().toISOString(),
      holidays: formattedHolidays
    });
    console.log(`[Server Helper Cache Saved] Successfully cached ${normCountry}_${year} in Firestore`);
  } catch (dbError) {
    console.error('Failed to cache fetched holidays in Firestore:', dbError);
  }

  return formattedHolidays;
}
