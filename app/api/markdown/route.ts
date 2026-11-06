import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get('path') || '/';

  try {
    const fullSpecPath = path.join(process.cwd(), 'public', 'llms-full.txt');
    const summaryPath = path.join(process.cwd(), 'public', 'llms.txt');

    let markdownContent = '';

    if (fs.existsSync(fullSpecPath)) {
      markdownContent = fs.readFileSync(fullSpecPath, 'utf8');
    } else if (fs.existsSync(summaryPath)) {
      markdownContent = fs.readFileSync(summaryPath, 'utf8');
    } else {
      markdownContent = `# Clocks and Alarms Online\n\nHigh-precision web timekeeping, world clocks, alarms, and timers.\nVisit https://clocksandalarmsonline.com for tools.`;
    }

    // If a specific tool route was requested, optionally highlight that section
    const cleanPath = targetPath.replace(/\/$/, '').toLowerCase();
    
    return new Response(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Link': '<https://clocksandalarmsonline.com/llms.txt>; rel="alternate"; type="text/markdown", <https://clocksandalarmsonline.com/.well-known/mcp/server-card.json>; rel="service-desc"',
      },
    });
  } catch (err: any) {
    return new Response(`# Clocks and Alarms Online\n\nError retrieving markdown document.`, {
      status: 500,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  }
}

