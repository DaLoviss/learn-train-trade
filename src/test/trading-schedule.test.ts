import { describe, expect, it } from "vitest";

import { GROUPS } from "@/lib/instruments";
import {
  addDaysToDateKey,
  dayRangeKeys,
  formatScheduleWindows,
  getDateKeyInTimeZone,
  getDaySchedule,
  officialTradingHoursUrl,
  startOfWeekDateKey,
} from "@/lib/trading-schedule";

describe("instrument trading schedule", () => {
  it("points the CME Group link at the date it is given", () => {
    expect(officialTradingHoursUrl("2026-11-26")).toBe(
      "https://www.cmegroup.com/trading-hours.html#tradeDate=2026-11-26",
    );
  });

  it("leaves the date off the CME Group link until today is known", () => {
    expect(officialTradingHoursUrl("")).toBe("https://www.cmegroup.com/trading-hours.html");
  });

  it("uses the visitor's own calendar day for the CME Group link", () => {
    const dateKey = getDateKeyInTimeZone(new Date("2026-11-27T06:37:00Z"), "America/New_York");
    expect(dateKey).toBe("2026-11-27");
    expect(officialTradingHoursUrl(dateKey)).toContain("#tradeDate=2026-11-27");
  });

  it("flags Thanksgiving 2026 as an early close for US indices", () => {
    const schedule = getDaySchedule("US500", "Stock Indices", "2026-11-26");
    expect(schedule.status).toBe("early-close");
    expect(schedule.windows).toEqual([
      { open: 0, close: 720 },
      { open: 1020, close: 1440 },
    ]);
    expect(schedule.note).toContain("12:00 PM CT");
  });

  it("uses the later early close on the day after Thanksgiving", () => {
    const schedule = getDaySchedule("US30", "Stock Indices", "2026-11-27");
    expect(schedule.status).toBe("early-close");
    expect(schedule.windows).toEqual([{ open: 0, close: 735 }]);
    expect(schedule.note).toContain("12:15 PM CT");
  });

  it("shows metals closing at 1:30 PM CT on Thanksgiving", () => {
    const schedule = getDaySchedule("XAU/USD", "Precious Metals", "2026-11-26");
    expect(schedule.status).toBe("early-close");
    expect(schedule.windows[0]?.close).toBe(810);
    expect(schedule.note).toContain("1:30 PM CT");
  });

  it("keeps forex at regular hours on Thanksgiving itself", () => {
    const schedule = getDaySchedule("EUR/USD", "Major Pairs", "2026-11-26");
    expect(schedule.status).toBe("regular");
    expect(schedule.windows).toEqual([{ open: 0, close: 1440 }]);
  });

  it("marks currency futures for their 1:45 PM CT Friday close", () => {
    const schedule = getDaySchedule("GBP/USD", "Major Pairs", "2026-11-27");
    expect(schedule.status).toBe("early-close");
    expect(schedule.windows).toEqual([{ open: 0, close: 825 }]);
  });

  it("converts the Thanksgiving US-index halt to 18:00 UTC", () => {
    const schedule = getDaySchedule("NAS100", "Stock Indices", "2026-11-26");
    expect(formatScheduleWindows(schedule, "UTC")).toContain("18:00");
  });

  it("closes instruments on Saturday", () => {
    for (const group of GROUPS) {
      const item = group.items[0];
      if (!item) throw new Error(`No instrument in ${group.title}`);
      expect(getDaySchedule(item.symbol, group.title, "2026-11-28").status).toBe("closed");
    }
  });

  it("provides a schedule for every listed instrument", () => {
    for (const group of GROUPS) {
      for (const item of group.items) {
        const schedule = getDaySchedule(item.symbol, group.title, "2026-11-25");
        expect(schedule.windows.length).toBeGreaterThan(0);
        expect(schedule.marketTimeZone.length).toBeGreaterThan(0);
      }
    }
  });

  it("moves to the next calendar day across month boundaries", () => {
    expect(addDaysToDateKey("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDaysToDateKey("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("shows the whole Monday to Sunday week when this week is selected", () => {
    expect(dayRangeKeys("this-week", "2026-11-26")).toEqual([
      "2026-11-23",
      "2026-11-24",
      "2026-11-25",
      "2026-11-26",
      "2026-11-27",
      "2026-11-28",
      "2026-11-29",
    ]);
  });

  it("shows only today through Sunday for the rest of the week", () => {
    expect(dayRangeKeys("rest-of-week", "2026-11-26")).toEqual([
      "2026-11-26",
      "2026-11-27",
      "2026-11-28",
      "2026-11-29",
    ]);
  });

  it("shows a single day when the week has one day left", () => {
    expect(dayRangeKeys("rest-of-week", "2026-11-29")).toEqual(["2026-11-29"]);
  });

  it("keeps the today and tomorrow views unchanged", () => {
    expect(dayRangeKeys("today", "2026-11-26")).toEqual(["2026-11-26"]);
    expect(dayRangeKeys("tomorrow", "2026-11-26")).toEqual(["2026-11-27"]);
    expect(dayRangeKeys("both", "2026-11-26")).toEqual(["2026-11-26", "2026-11-27"]);
  });

  it("rolls Sunday back to the Monday that started its week", () => {
    expect(startOfWeekDateKey("2026-11-29")).toBe("2026-11-23");
    expect(startOfWeekDateKey("2026-11-23")).toBe("2026-11-23");
  });

  it("returns a schedule for every instrument on every day of the week", () => {
    for (const dateKey of dayRangeKeys("this-week", "2026-11-26")) {
      for (const group of GROUPS) {
        for (const item of group.items) {
          const schedule = getDaySchedule(item.symbol, group.title, dateKey);
          expect(schedule.status).toMatch(/regular|early-close|closed/);
        }
      }
    }
  });
});
