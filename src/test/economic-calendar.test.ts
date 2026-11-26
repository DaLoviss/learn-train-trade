import { describe, expect, it } from "vitest";
import {
  filterCalendarEvents,
  getCalendarDays,
  parseForexFactoryEvents,
} from "@/lib/economic-calendar";

describe("ForexFactory economic calendar feed", () => {
  it("parses valid events, skips malformed rows, and sorts chronologically", () => {
    const events = parseForexFactoryEvents([
      {
        title: "Prelim GDP q/q",
        country: "usd",
        date: "2026-11-25T08:30:00-05:00",
        impact: "High",
        actual: "3.6%",
        forecast: "3.5%",
        previous: "3.4%",
      },
      {
        title: "",
        country: "EUR",
        date: "2026-11-24T04:00:00-05:00",
        impact: "Low",
      },
      {
        title: "CPI y/y",
        country: "AUD",
        date: "2026-11-24T19:30:00-05:00",
        impact: "High",
        forecast: "4.7%",
        previous: "4.3%",
      },
    ]);

    expect(events).toHaveLength(2);
    expect(events[0]?.title).toBe("CPI y/y");
    expect(events[0]?.actual).toBe("");
    expect(events[1]?.country).toBe("USD");
    expect(events[1]?.actual).toBe("3.6%");
    expect(events[1]?.forecast).toBe("3.5%");
  });

  it("filters events by currency and impact level", () => {
    const events = parseForexFactoryEvents([
      { title: "Core PCE", country: "USD", date: "2026-11-25T08:30:00-05:00", impact: "High", forecast: "0.3%", previous: "0.3%" },
      { title: "Beige Book", country: "USD", date: "2026-11-25T14:00:00-05:00", impact: "Low", forecast: "", previous: "" },
      { title: "Tokyo Core CPI", country: "JPY", date: "2026-11-26T18:30:00-05:00", impact: "Medium", forecast: "3.0%", previous: "2.6%" },
    ]);

    expect(filterCalendarEvents(events, "USD", "High")).toHaveLength(1);
    expect(filterCalendarEvents(events, "USD", "ALL")).toHaveLength(2);
    expect(filterCalendarEvents(events, "ALL", "Medium")[0]?.country).toBe("JPY");
  });

  it("filters events by date and lists unique calendar days", () => {
    const events = parseForexFactoryEvents([
      { title: "Bank Holiday", country: "USD", date: "2026-11-26T00:00:00Z", impact: "Holiday" },
      { title: "Core PCE", country: "USD", date: "2026-11-25T13:30:00Z", impact: "High", actual: "0.3%", forecast: "0.3%" },
      { title: "GDP q/q", country: "CAD", date: "2026-11-26T13:30:00Z", impact: "High", forecast: "0.2%" },
    ]);

    const days = getCalendarDays(events, false);
    expect(days.map((d) => d.dayKey)).toEqual(["2026-11-25", "2026-11-26"]);
    expect(filterCalendarEvents(events, "ALL", "ALL", "2026-11-26", false)).toHaveLength(2);
    expect(filterCalendarEvents(events, "USD", "Holiday", "2026-11-26", false)[0]?.title).toBe("Bank Holiday");
  });
});