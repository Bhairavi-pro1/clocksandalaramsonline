import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * High-precision server time endpoint for cross-device clock synchronization.
 * Prevents client-side manual clock tampering (forward/backward drift) from disrupting shared timers.
 */
export async function GET() {
  return NextResponse.json(
    { serverTime: Date.now() },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  )
}

