const timezoneCountryMap: Record<string, string> = {
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Europe/London': 'GB',
  'Europe/Belfast': 'GB',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Asia/Tokyo': 'JP',
  'Asia/Singapore': 'SG',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Hong_Kong': 'HK',
  'Asia/Taipei': 'TW',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
  'America/Anchorage': 'US',
  'America/Honolulu': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Winnipeg': 'CA',
  'America/Edmonton': 'CA',
  'America/Mexico_City': 'MX',
  'America/Sao_Paulo': 'BR',
  'America/Buenos_Aires': 'AR',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Adelaide': 'AU',
  'Australia/Perth': 'AU',
  'Africa/Johannesburg': 'ZA',
  'Europe/Moscow': 'RU',
  'Asia/Dubai': 'AE',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH',
  'Europe/Vienna': 'AT',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI',
  'Europe/Dublin': 'IE',
  'Europe/Athens': 'GR',
  'Europe/Istanbul': 'TR',
  'Asia/Jakarta': 'ID',
  'Asia/Bangkok': 'TH',
  'Asia/Manila': 'PH',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Karachi': 'PK',
  'Asia/Dhaka': 'BD',
  'Asia/Colombo': 'LK',
  'Asia/Kathmandu': 'NP',
  'Pacific/Auckland': 'NZ',
  'Africa/Cairo': 'EG',
  'Africa/Nairobi': 'KE',
  'Africa/Lagos': 'NG',
  'America/Bogota': 'CO',
  'America/Santiago': 'CL',
  'America/Lima': 'PE',
  'America/Caracas': 'VE'
};

export function getCountryFromTimezone(timezone?: string): string {
  const tz = timezone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '');
  if (!tz) return 'US';
  
  if (timezoneCountryMap[tz]) {
    return timezoneCountryMap[tz];
  }
  
  if (tz.startsWith('America/')) return 'US';
  if (tz.startsWith('Europe/')) return 'GB';
  if (tz.startsWith('Asia/')) return 'IN';
  if (tz.startsWith('Australia/')) return 'AU';
  if (tz.startsWith('Africa/')) return 'ZA';
  if (tz.startsWith('Pacific/')) return 'NZ';
  
  return 'US';
}
