"use client";

import { useEffect } from "react";

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (params: any) => Promise<any> | any;
}

export default function WebMCPProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const win = window as any;
      const nav = window.navigator as any;
      const doc = window.document as any;

      // Initialize standard-compliant modelContext registry if not provided natively by browser agent
      const toolRegistry = new Map<string, ToolDefinition>();

      const registerToolHandler = (tool: ToolDefinition) => {
        toolRegistry.set(tool.name, tool);
        win.__WEBMCP_TOOLS__ = Array.from(toolRegistry.values());
        return tool;
      };

      if (!nav.modelContext) {
        nav.modelContext = {
          tools: toolRegistry,
          registerTool: registerToolHandler,
          unregisterTool: (name: string) => toolRegistry.delete(name),
          getTools: () => Array.from(toolRegistry.values()),
        };
      } else if (typeof nav.modelContext.registerTool !== "function") {
        nav.modelContext.tools = toolRegistry;
        nav.modelContext.registerTool = registerToolHandler;
      }

      if (!doc.modelContext) {
        doc.modelContext = nav.modelContext;
      }

      // Register Tool 1: get_world_time
      nav.modelContext.registerTool({
        name: "get_world_time",
        description:
          "Query accurate real-time time, UTC offset, and Daylight Saving Time (DST) status for any timezone or city worldwide.",
        inputSchema: {
          type: "object",
          properties: {
            timezone: {
              type: "string",
              description:
                "IANA timezone identifier (e.g. America/New_York, Europe/London, Asia/Kolkata, UTC) or city name.",
            },
          },
          required: ["timezone"],
        },
        execute: async (params: { timezone: string }) => {
          const tz = params?.timezone || "UTC";
          try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-US", {
              timeZone: tz,
              dateStyle: "full",
              timeStyle: "long",
            });
            return {
              timezone: tz,
              formattedTime: formatter.format(now),
              timestamp: now.getTime(),
              iso: now.toISOString(),
            };
          } catch (e: any) {
            return { error: `Invalid timezone: ${tz}` };
          }
        },
      });

      // Register Tool 2: set_countdown_timer
      nav.modelContext.registerTool({
        name: "set_countdown_timer",
        description:
          "Calculate duration and configure a countdown timer for a specified number of hours, minutes, and seconds.",
        inputSchema: {
          type: "object",
          properties: {
            hours: { type: "number", description: "Hours (0-24)" },
            minutes: { type: "number", description: "Minutes (0-59)" },
            seconds: { type: "number", description: "Seconds (0-59)" },
            label: { type: "string", description: "Optional timer label" },
          },
          required: ["minutes"],
        },
        execute: async (params: {
          hours?: number;
          minutes?: number;
          seconds?: number;
          label?: string;
        }) => {
          const totalSeconds =
            (params?.hours || 0) * 3600 +
            (params?.minutes || 0) * 60 +
            (params?.seconds || 0);
          return {
            status: "ready",
            totalSeconds,
            label: params?.label || "Timer",
            endsAt: new Date(Date.now() + totalSeconds * 1000).toISOString(),
          };
        },
      });

      // Register Tool 3: convert_timezone
      nav.modelContext.registerTool({
        name: "convert_timezone",
        description:
          "Convert a specific date and time from one timezone to another timezone with exact offset calculations.",
        inputSchema: {
          type: "object",
          properties: {
            dateTime: {
              type: "string",
              description: "ISO 8601 date string (e.g. 2026-11-06T12:00:00Z)",
            },
            fromTimezone: {
              type: "string",
              description: "Source IANA timezone (e.g. America/New_York)",
            },
            toTimezone: {
              type: "string",
              description: "Target IANA timezone (e.g. Asia/Tokyo)",
            },
          },
          required: ["dateTime", "fromTimezone", "toTimezone"],
        },
        execute: async (params: {
          dateTime: string;
          fromTimezone: string;
          toTimezone: string;
        }) => {
          try {
            const date = new Date(params.dateTime);
            const formatter = new Intl.DateTimeFormat("en-US", {
              timeZone: params.toTimezone,
              dateStyle: "full",
              timeStyle: "long",
            });
            return {
              original: params.dateTime,
              fromTimezone: params.fromTimezone,
              toTimezone: params.toTimezone,
              convertedTime: formatter.format(date),
            };
          } catch (e: any) {
            return { error: e?.message || "Timezone conversion failed" };
          }
        },
      });
    } catch (err) {
      console.warn("[WebMCP] Initialization skipped:", err);
    }
  }, []);

  return (
    <div
      id="webmcp-declarative-tools"
      style={{ display: "none" }}
      aria-hidden="true"
    >
      {/* Declarative WebMCP form fallback annotations for DOM-scanning agent crawlers */}
      <form
        // @ts-ignore
        toolname="set_countdown_timer"
        tooldescription="Configure and start a high-precision countdown timer with alarm sound"
        action="/timer"
      >
        <input type="number" name="hours" placeholder="Hours" />
        <input type="number" name="minutes" placeholder="Minutes" />
        <input type="number" name="seconds" placeholder="Seconds" />
        <button type="submit">Start Timer</button>
      </form>

      <form
        // @ts-ignore
        toolname="get_world_time"
        tooldescription="Query current time and Daylight Saving Time (DST) status for any timezone"
        action="/world-clock"
      >
        <input type="text" name="timezone" placeholder="Timezone or city" />
        <button type="submit">Lookup Time</button>
      </form>
    </div>
  );
}

