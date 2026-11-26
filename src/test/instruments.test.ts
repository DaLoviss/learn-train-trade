import { describe, expect, it } from "vitest";

import { GROUPS, INDICES_GROUP, SESSIONS } from "@/lib/instruments";

describe("Instruments data", () => {
  it("lists a Stock Indices group after the metals group", () => {
    const titles = GROUPS.map((group) => group.title);
    expect(titles).toContain("Stock Indices");
    expect(titles.indexOf("Stock Indices")).toBeGreaterThan(titles.indexOf("Precious Metals"));
  });

  it("shows the benchmark index symbols traders search for", () => {
    const symbols = INDICES_GROUP.items.map((item) => item.symbol);
    expect(symbols).toEqual(
      expect.arrayContaining(["US30", "US500", "NAS100", "DE40", "UK100", "JP225", "HK50", "AU200"]),
    );
  });

  it("names the exchange session behind each index", () => {
    for (const item of INDICES_GROUP.items) {
      const sessionNames = SESSIONS.map((session) => session.name);
      const mentioned = sessionNames.filter((name) => item.activeSessions.includes(name));
      expect(mentioned.length, `${item.symbol} should name a trading session`).toBeGreaterThan(0);
      expect(item.dailyHours).toContain("UTC");
    }
  });

  it("gives every instrument a usable symbol, session and trading window", () => {
    for (const group of GROUPS) {
      for (const item of group.items) {
        expect(item.symbol.length, `${group.title} item needs a symbol`).toBeGreaterThan(1);
        expect(item.activeSessions.length).toBeGreaterThan(0);
        expect(Number.isInteger(item.startUtc)).toBe(true);
        expect(Number.isInteger(item.endUtc)).toBe(true);
        expect(item.startUtc).toBeGreaterThanOrEqual(0);
        expect(item.endUtc).toBeLessThanOrEqual(23);
        expect(item.dailyHours.length).toBeGreaterThan(0);
      }
    }
  });
});
