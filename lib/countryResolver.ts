import countriesData from '@/data/countries.json';

export interface CountryItem {
  name: string;
  code: string;
}

/**
 * Converts a country name into a clean, SEO-optimized URL slug.
 * E.g., "United States" -> "united-states", "Antigua and Barbuda" -> "antigua-and-barbuda"
 */
export function slugifyCountry(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with hyphen
    .replace(/(^-|-$)/g, '');        // trim leading/trailing hyphens
}

// Pre-computed index maps for O(1) high-speed lookups
const slugToCountryMap = new Map<string, CountryItem>();
const codeToCountryMap = new Map<string, CountryItem>();
const codeToSlugMap = new Map<string, string>();

for (const country of countriesData as CountryItem[]) {
  const slug = slugifyCountry(country.name);
  slugToCountryMap.set(slug, country);
  codeToCountryMap.set(country.code.toLowerCase(), country);
  codeToSlugMap.set(country.code.toLowerCase(), slug);
}

/**
 * Resolves a country item by its slug (e.g. "united-states") or 2-letter ISO code (e.g. "US").
 */
export function getCountryBySlugOrCode(slugOrCode: string): CountryItem | undefined {
  if (!slugOrCode) return undefined;
  const clean = slugOrCode.toLowerCase().trim();
  return slugToCountryMap.get(clean) || codeToCountryMap.get(clean);
}

/**
 * Gets the canonical URL slug for a given country code or country name.
 * E.g., "US" -> "united-states", "United States" -> "united-states"
 */
export function getCountrySlug(codeOrName: string): string {
  if (!codeOrName) return '';
  const clean = codeOrName.toLowerCase().trim();
  
  // If it's a 2-letter code
  const fromCode = codeToSlugMap.get(clean);
  if (fromCode) return fromCode;

  // If it's already a slug or a country name
  const fromSlug = slugToCountryMap.get(clean);
  if (fromSlug) return clean;

  // Otherwise slugify the input
  return slugifyCountry(codeOrName);
}

/**
 * Returns all countries with their canonical slug.
 */
export function getAllCountriesWithSlugs(): Array<CountryItem & { slug: string }> {
  return (countriesData as CountryItem[]).map(c => ({
    ...c,
    slug: slugifyCountry(c.name)
  }));
}

