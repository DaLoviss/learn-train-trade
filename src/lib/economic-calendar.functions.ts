import { createServerFn } from "@tanstack/react-start";
import {
  buildFxStreetCalendarUrl,
  parseFxStreetEvents,
  type CalendarEvent,
} from "./economic-calendar";

export type CalendarFeedResult = {
  events: CalendarEvent[];
  fetchedAt: string;
  error: string | null;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedFeed: { result: CalendarFeedResult; expiresAt: number } | null = null;

export const getEconomicCalendar = createServerFn({ method: "GET" }).handler(
  async (): Promise<CalendarFeedResult> => {
    const now = Date.now();
    if (cachedFeed && cachedFeed.expiresAt > now && cachedFeed.result.events.length > 0) {
      return cachedFeed.result;
    }
    try {
      const response = await fetch(buildFxStreetCalendarUrl(new Date(now)), {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; LearnTrainTrade/1.0)",
          Origin: "https://www.fxstreet.com",
          Referer: "https://www.fxstreet.com/",
        },
        redirect: "manual",
      });
      if (!response.ok || response.status >= 300) {
        if (cachedFeed && cachedFeed.result.events.length > 0) return cachedFeed.result;
        return {
          events: [],
          fetchedAt: new Date().toISOString(),
          error: "FXStreet economic calendar is temporarily unavailable.",
        };
      }
      const json: unknown = await response.json();
      const result: CalendarFeedResult = {
        events: parseFxStreetEvents(json),
        fetchedAt: new Date().toISOString(),
        error: null,
      };
      if (result.events.length > 0) {
        cachedFeed = { result, expiresAt: now + CACHE_TTL_MS };
      }
      return result;
    } catch {
      if (cachedFeed && cachedFeed.result.events.length > 0) return cachedFeed.result;
      return {
        events: [],
        fetchedAt: new Date().toISOString(),
        error: "Could not load the FXStreet economic calendar right now.",
      };
    }
  },
);