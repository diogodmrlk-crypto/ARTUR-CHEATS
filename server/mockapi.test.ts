import { describe, expect, it, vi } from "vitest";
import { createMockKey, listMockKeys, mockKeyToLicense } from "./mockapi";
import { activationExpirySeconds } from "../shared/rbxis";

describe("MockAPI key expiration", () => {
  it("expires an hourly key exactly one hour after activation", () => {
    const activatedAt = 1_800_000_000;
    expect(activationExpirySeconds("hourly", 1, activatedAt)).toBe(activatedAt + 3_600);
  });

  it("keeps permanent keys without an expiry timestamp", () => {
    expect(activationExpirySeconds("perm", 0, 1_800_000_000)).toBe(0);
  });

  it("expires a monthly key exactly 30 days after first activation", () => {
    const activatedAt = 1_800_000_000;
    expect(activationExpirySeconds("monthly", 30, activatedAt)).toBe(activatedAt + 30 * 24 * 60 * 60);
  });

  it("maps the hourly type to a one-hour duration", () => {
    const license = mockKeyToLicense({ key: "CLEAN-SENSI-hourly-test", used: false, device: "", expire: 1, type: "hourly", createdAt: 1_800_000_000, activatedAt: 0, expiresAt: 0 });
    expect(license.planId).toBe("hourly");
    expect(license.durationValue).toBe(1);
    expect(license.durationUnit).toBe("hours");
  });

  it("posts an hourly key using the existing MockAPI fields", async () => {
    let posted: Record<string, unknown> | undefined;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => {
      posted = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response(JSON.stringify({ id: "hourly-test-1", ...posted }), { status: 201, headers: { "content-type": "application/json" } });
    });
    try {
      const key = await createMockKey({ username: "hour_test", planId: "hourly", durationValue: 1, durationUnit: "hours" });
      expect(key.type).toBe("hourly");
      expect(posted).toMatchObject({ username: "hour_test", type: "hourly", expire: 1, used: false, activatedAt: 0, expiresAt: 0, status: "active" });
      expect(String(posted?.key)).toMatch(/^CLEAN-SENSI-hourly-/);
      expect(posted).not.toHaveProperty("durationUnit");
    } finally {
      fetch.mockRestore();
    }
  });
});

  it("posts a monthly key as 30 stored days and maps it back to one month", async () => {
    let posted: Record<string, unknown> | undefined;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => {
      posted = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response(JSON.stringify({ id: "monthly-test-1", ...posted }), { status: 201, headers: { "content-type": "application/json" } });
    });
    try {
      const key = await createMockKey({ username: "monthly_test", planId: "monthly", durationValue: 1, durationUnit: "months" });
      const license = mockKeyToLicense(key);
      expect(posted).toMatchObject({ username: "monthly_test", type: "monthly", expire: 30, used: false, activatedAt: 0, expiresAt: 0, status: "active" });
      expect(String(posted?.key)).toMatch(/^CLEAN-SENSI-monthly-/);
      expect(license.planId).toBe("monthly");
      expect(license.durationValue).toBe(1);
      expect(license.durationUnit).toBe("months");
    } finally {
      fetch.mockRestore();
    }
  });

describe("MockAPI keys integration", () => {
  it("reads every collection page so bulk copy/reset can include all keys", async () => {
    const makeRow = (id: number) => ({ id: String(id), key: `CLEAN-SENSI-test-${id}`, used: false, device: "", expire: 1, type: "daily", createdAt: id, activatedAt: 0, expiresAt: 0 });
    const firstPage = Array.from({ length: 100 }, (_, index) => makeRow(index + 1));
    const secondPage = [makeRow(101)];
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      const page = new URL(String(input)).searchParams.get("page");
      const rows = page === "1" ? firstPage : page === "2" ? secondPage : [];
      return new Response(JSON.stringify(rows), { status: 200, headers: { "content-type": "application/json" } });
    });
    try {
      const keys = await listMockKeys();
      expect(keys).toHaveLength(101);
      expect(fetch).toHaveBeenCalledTimes(2);
    } finally {
      fetch.mockRestore();
    }
  });

  it("reads the configured keys collection", async () => {
    const keys = await listMockKeys();
    expect(Array.isArray(keys)).toBe(true);
  });
});
