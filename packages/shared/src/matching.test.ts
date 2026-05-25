import { describe, expect, it } from "vitest";
import { distanceKm, isMutualMatch } from "./matching";

describe("matching", () => {
  it("detects mutual likes", () => {
    expect(
      isMutualMatch("a", "b", [
        { fromUserId: "a", toUserId: "b", action: "like", createdAt: new Date() },
        { fromUserId: "b", toUserId: "a", action: "like", createdAt: new Date() }
      ])
    ).toBe(true);
  });

  it("does not match a pass", () => {
    expect(
      isMutualMatch("a", "b", [
        { fromUserId: "a", toUserId: "b", action: "like", createdAt: new Date() },
        { fromUserId: "b", toUserId: "a", action: "pass", createdAt: new Date() }
      ])
    ).toBe(false);
  });

  it("computes geographic distance", () => {
    const torontoToNewYork = distanceKm(
      { latitude: 43.6532, longitude: -79.3832 },
      { latitude: 40.7128, longitude: -74.006 }
    );

    expect(torontoToNewYork).toBeGreaterThan(540);
    expect(torontoToNewYork).toBeLessThan(570);
  });
});
