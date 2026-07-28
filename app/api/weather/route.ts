import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat or lon parameter' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'ClocksAndAlarmsOnline/1.0 (https://clocksandalarmsonline.com; contact@clocksandalarmsonline.com)',
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    )

    if (!res.ok) {
      return NextResponse.json({ error: `MET Norway API returned status ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
