import { createServerFn } from "@tanstack/react-start";
import {
  FOREX_FACTORY_FEED_URL,
  parseForexFactoryEvents,
  type CalendarEvent,
} from "./economic-calendar";

export type CalendarFeedResult = {
  events: CalendarEvent[];
  fetchedAt: string;
  error: string | null;
};

const CACHE_TTL_MS = 15 * 60 * 1000;
let cachedFeed: { result: CalendarFeedResult; expiresAt: number } | null = null;

export const getForexFactoryCalendar = createServerFn({ method: "GET" }).handler(
  async (): Promise<CalendarFeedResult> => {
    const now = Date.now();
    if (cachedFeed && cachedFeed.expiresAt > now && cachedFeed.result.events.length > 0) {
      return cachedFeed.result;
    }
    try {
      const response = await fetch(FOREX_FACTORY_FEED_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; LearnTrainTrade/1.0)",
        },
        redirect: "manual",
      });
      if (!response.ok || response.status >= 300) {
        if (cachedFeed && cachedFeed.result.events.length > 0) return cachedFeed.result;
        return {
          events: [],
          fetchedAt: new Date().toISOString(),
          error: "ForexFactory calendar is temporarily unavailable.",
        };
      }
      const json: unknown = await response.json();
      const result: CalendarFeedResult = {
        events: parseForexFactoryEvents(json),
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
        error: "Could not load the ForexFactory calendar right now.",
      };
    }
  },
);