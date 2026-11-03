import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface FormattedHoliday {
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: string[];
}

const CATEGORY_PRIORITY: Record<string, number> = {
  'national holiday': 100,
  'federal holiday': 95,
  'public holiday': 90,
  'religious': 80,
  'christian': 80,
  'hinduism': 80,
  'muslim': 80,
  'hebrew': 80,
  'orthodox': 80,
  'observance': 70,
  'worldwide observance': 65,
  'united nations observance': 60,
  'season': 50,
  'clock change/daylight saving time': 45,
  'sporting event': 40,
  'local holiday': 30,
  'local observance': 20,
};

function normalizeHolidayKey(name: string): string {
  return name.toLowerCase().replace(/[^\w]/g, '');
}

/**
 * Deduplicates and merges holiday entries returned by the API or cache.
 * Calendarific frequently returns regional state-level copies (e.g., Election Day or Veterans Day
 * in multiple US states) or dual categories (e.g., Diwali as Hinduism + Local Observance).
 * This function merges identical holidays on the same date while consolidating their tags.
 */
export function deduplicateHolidays(rawHolidays: FormattedHoliday[]): FormattedHoliday[] {
  if (!Array.isArray(rawHolidays) || rawHolidays.length === 0) {
    return [];
  }

  const map = new Map<string, FormattedHoliday>();

  for (const h of rawHolidays) {
    if (!h || !h.name || !h.date) continue;

    const dateKey = (h.date || '').substring(0, 10);
    const cleanKey = normalizeHolidayKey(h.name);

    let matchedGroupKey: string | null = null;
    const directKey = `${dateKey}_${cleanKey}`;

    if (map.has(directKey)) {
      matchedGroupKey = directKey;
    } else {
      // Check slashed alias match on the same date (e.g. "Veterans' Day/Armistice Day" vs "Veterans Day")
      const slashParts = h.name.split(/[\/\\]/).map(s => normalizeHolidayKey(s)).filter(Boolean);

      for (const [existingKey, existingItem] of map.entries()) {
        if (!existingKey.startsWith(dateKey + '_')) continue;

        const existingParts = existingItem.name.split(/[\/\\]/).map(s => normalizeHolidayKey(s)).filter(Boolean);

        const matchesPart = slashParts.some(p => existingParts.includes(p)) ||
          existingParts.some(p => p === cleanKey) ||
          slashParts.some(p => p === normalizeHolidayKey(existingItem.name));

        if (matchesPart) {
          matchedGroupKey = existingKey;
          break;
        }
      }
    }

    const currentTypes = Array.isArray(h.type) ? h.type : [h.type || 'observance'];

    if (matchedGroupKey) {
      const existing = map.get(matchedGroupKey)!;
      
      // Merge unique types and sort by priority (e.g. National > Religious > Observance > Local)
      const combinedTypes = Array.from(new Set([...existing.type, ...currentTypes]));
      combinedTypes.sort((a, b) => {
        const pA = CATEGORY_PRIORITY[a.toLowerCase()] ?? 10;
        const pB = CATEGORY_PRIORITY[b.toLowerCase()] ?? 10;
        return pB - pA;
      });
      existing.type = combinedTypes;

      // Retain the longer, more detailed description
      if ((h.description || '').length > (existing.description || '').length) {
        existing.description = h.description;
      }

      // If existing name has slash but incoming name is cleaner without slash, prefer cleaner title
      if (!h.name.includes('/') && existing.name.includes('/')) {
        existing.name = h.name;
      }
    } else {
      const sortedTypes = [...currentTypes].sort((a, b) => {
        const pA = CATEGORY_PRIORITY[a.toLowerCase()] ?? 10;
        const pB = CATEGORY_PRIORITY[b.toLowerCase()] ?? 10;
        return pB - pA;
      });

      map.set(directKey, {
        name: h.name,
        description: h.description || '',
        date: dateKey,
        type: sortedTypes
      });
    }
  }

  return Array.from(map.values());
}

export async function getHolidaysServer(country: string, year: number): Promise<FormattedHoliday[]> {
  const normCountry = country.toUpperCase();
  const docId = `${normCountry}_${year}`;
  const docRef = doc(db, 'holiday_cache', docId);

  // 1. Try reading from Firestore cache first
  try {
    const cachedDoc = await getDoc(docRef);
    if (cachedDoc.exists()) {
      const cachedData = cachedDoc.data();
      if (cachedData.holidays && Array.isArray(cachedData.holidays) && cachedData.holidays.length > 0) {
        console.log(`[Server Helper Cache Hit] Served ${normCountry}_${year} from Firestore`);
        // Deduplicate cached records to clean up legacy cached data immediately
        return deduplicateHolidays(cachedData.holidays);
      }
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

  const rawFormatted: FormattedHoliday[] = data.response.holidays.map((h: any) => ({
    name: h.name,
    description: h.description || '',
    date: (h.date?.iso || `${h.date?.datetime?.year}-${String(h.date?.datetime?.month).padStart(2, '0')}-${String(h.date?.datetime?.day).padStart(2, '0')}`).substring(0, 10),
    type: Array.isArray(h.type) ? h.type : [h.type || 'observance']
  }));

  const cleanHolidays = deduplicateHolidays(rawFormatted);

  // 3. Cache clean deduplicated holidays to Firestore
  try {
    await setDoc(docRef, {
      country: normCountry,
      year,
      lastUpdated: new Date().toISOString(),
      holidays: cleanHolidays
    });
    console.log(`[Server Helper Cache Saved] Successfully cached ${normCountry}_${year} in Firestore`);
  } catch (dbError) {
    console.error('Failed to cache fetched holidays in Firestore:', dbError);
  }

  return cleanHolidays;
}
