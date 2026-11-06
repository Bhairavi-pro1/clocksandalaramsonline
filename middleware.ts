import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';
  const pathname = request.nextUrl.pathname;

  // RFC 8288 Link header for AI agent discovery
  const linkHeader = '<https://clocksandalarmsonline.com/llms.txt>; rel="alternate"; type="text/markdown", <https://clocksandalarmsonline.com/.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"';

  // Issue 5: Serve Markdown when an agent requests Accept: text/markdown
  if (acceptHeader.includes('text/markdown')) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = '/api/markdown';
    rewriteUrl.searchParams.set('path', pathname);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('Link', linkHeader);
    response.headers.set('Vary', 'Accept');
    return response;
  }

  // Issue 6: Add RFC 8288 Link header to standard web responses
  const response = NextResponse.next();
  response.headers.set('Link', linkHeader);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static asset files (images, audio, icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.png|assets|sounds|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|wav|ogg)$).*)',
  ],
};

