import { describe, expect, it } from "vitest";
import {
  filterCalendarEvents,
  getCalendarDays,
  getWeekRangeUtc,
  parseFxStreetEvents,
} from "@/lib/economic-calendar";

describe("FXStreet economic calendar feed", () => {
  it("parses valid major-currency events with actual, forecast, and previous values", () => {
    const events = parseFxStreetEvents([
      {
        id: "evt-2",
        name: "Prelim GDP q/q",
        currencyCode: "usd",
        dateUtc: "2026-11-25T13:30:00Z",
        volatility: "HIGH",
        actual: 3.6,
        consensus: 3.5,
        previous: 3.4,
        unit: "%",
        potency: "ZERO",
      },
      {
        id: "evt-minor",
        name: "Local Release",
        currencyCode: "ARS",
        dateUtc: "2026-11-24T09:00:00Z",
        volatility: "LOW",
        actual: 1.2,
      },
      {
        id: "evt-1",
        name: "Nonfarm Payrolls",
        currencyCode: "AUD",
        dateUtc: "2026-11-24T00:30:00Z",
        volatility: "HIGH",
        actual: null,
        consensus: 25,
        previous: 18,
        unit: null,
        potency: "K",
      },
    ]);

    expect(events).toHaveLength(2);
    expect(events[0]?.title).toBe("Nonfarm Payrolls");
    expect(events[0]?.actual).toBe("");
    expect(events[0]?.forecast).toBe("25K");
    expect(events[1]?.country).toBe("USD");
    expect(events[1]?.actual).toBe("3.6%");
    expect(events[1]?.forecast).toBe("3.5%");
    expect(events[1]?.previous).toBe("3.4%");
  });

  it("filters events by currency and impact level", () => {
    const events = parseFxStreetEvents([
      { name: "Core PCE", currencyCode: "USD", dateUtc: "2026-11-25T13:30:00Z", volatility: "HIGH", actual: 0.3, consensus: 0.3, previous: 0.3, unit: "%" },
      { name: "Beige Book", currencyCode: "USD", dateUtc: "2026-11-25T19:00:00Z", volatility: "LOW" },
      { name: "Tokyo Core CPI", currencyCode: "JPY", dateUtc: "2026-11-26T23:30:00Z", volatility: "MEDIUM", consensus: 3.0, previous: 2.6, unit: "%" },
    ]);

    expect(filterCalendarEvents(events, "USD", "High")).toHaveLength(1);
    expect(filterCalendarEvents(events, "USD", "ALL")).toHaveLength(2);
    expect(filterCalendarEvents(events, "ALL", "Medium")[0]?.country).toBe("JPY");
  });

  it("maps NONE volatility to Holiday and filters by date", () => {
    const events = parseFxStreetEvents([
      { name: "Thanksgiving Day", currencyCode: "USD", dateUtc: "2026-11-26T05:00:00Z", volatility: "NONE" },
      { name: "Core PCE", currencyCode: "USD", dateUtc: "2026-11-25T13:30:00Z", volatility: "HIGH", actual: 0.3, consensus: 0.3, unit: "%" },
      { name: "GDP q/q", currencyCode: "CAD", dateUtc: "2026-11-26T13:30:00Z", volatility: "HIGH", consensus: 0.2, unit: "%" },
    ]);

    const days = getCalendarDays(events, false);
    expect(days.map((d) => d.dayKey)).toEqual(["2026-11-25", "2026-11-26"]);
    expect(filterCalendarEvents(events, "ALL", "ALL", "2026-11-26", false)).toHaveLength(2);
    expect(filterCalendarEvents(events, "USD", "Holiday", "2026-11-26", false)[0]?.title).toBe("Thanksgiving Day");
  });

  it("computes the Monday-to-Sunday UTC week range", () => {
    const range = getWeekRangeUtc(new Date("2026-11-27T06:00:00Z"));
    expect(range).toEqual({
      start: "2026-11-23T00:00:00Z",
      end: "2026-11-29T23:59:59Z",
    });
  });
});