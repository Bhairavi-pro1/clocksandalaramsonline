export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      result: {
        serverInfo: {
          name: 'clocks-and-alarms-online',
          version: '1.0.0',
        },
        capabilities: {
          tools: { listChanged: false },
        },
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, id, params } = body || {};

    if (method === 'tools/list') {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'get_world_time',
                description: 'Get high-precision current local time and DST status for any timezone or city.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    timezone: { type: 'string', description: 'IANA timezone identifier e.g. America/New_York' },
                  },
                  required: ['timezone'],
                },
              },
              {
                name: 'convert_timezone',
                description: 'Convert datetime from one timezone to another timezone.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    dateTime: { type: 'string', description: 'ISO 8601 string' },
                    sourceTimezone: { type: 'string' },
                    targetTimezone: { type: 'string' },
                  },
                  required: ['dateTime', 'sourceTimezone', 'targetTimezone'],
                },
              },
            ],
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      if (toolName === 'get_world_time') {
        const tz = toolArgs.timezone || 'UTC';
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(now);

        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    timezone: tz,
                    formatted,
                    iso: now.toISOString(),
                  }),
                },
              ],
            },
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: { status: 'acknowledged' },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: err?.message || 'Internal error' },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

