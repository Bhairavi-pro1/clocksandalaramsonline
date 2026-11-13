import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';

  // Issue 5: Serve Markdown when an AI agent requests Accept: text/markdown
  if (acceptHeader.includes('text/markdown')) {
    const linkHeader = '<https://clocksandalarmsonline.com/llms.txt>; rel="alternate"; type="text/markdown", <https://clocksandalarmsonline.com/.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"';
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = '/api/markdown';
    rewriteUrl.searchParams.set('path', request.nextUrl.pathname);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('Link', linkHeader);
    response.headers.set('Vary', 'Accept');
    return response;
  }

  // Standard requests proceed directly; Link and Content-Signal headers are served via next.config.ts at CDN level
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only page routes. Exclude:
     * - api routes (they don't serve markdown representations)
     * - _next (static and image files)
     * - static asset files (images, audio, icons, fonts)
     */
    '/((?!api|_next|favicon\\.ico|icon\\.png|assets|sounds|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav|ogg|woff|woff2|ttf|eot)$).*)',
  ],
};

