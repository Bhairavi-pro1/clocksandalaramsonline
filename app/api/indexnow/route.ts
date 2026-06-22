import { NextRequest, NextResponse } from 'next/server'
import sitemap from '@/app/sitemap'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (!secret || secret !== process.env.INDEXNOW_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sitemapEntries = await sitemap()
    const urls = sitemapEntries.map((entry) => entry.url)

    // Send sitemap URL list to IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host: 'clocksandalarmsonline.com',
        key: 'f63b4b5c7d8e9f0a1b2c3d4e5f6a7b8c',
        keyLocation: 'https://clocksandalarmsonline.com/f63b4b5c7d8e9f0a1b2c3d4e5f6a7b8c.txt',
        urlList: urls
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: 'Failed to submit to IndexNow', details: errorText }, { status: response.status })
    }

    return NextResponse.json({ success: true, count: urls.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
