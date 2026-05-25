import { describe, expect, it } from "vitest";
import { createAccountSchema, profileSchema } from "./schemas";

describe("schemas", () => {
  it("requires strong account passwords", () => {
    expect(
      createAccountSchema.safeParse({
        email: "user@example.com",
        password: "weak-password",
        displayName: "Ari",
        birthDate: "1996-04-12"
      }).success
    ).toBe(false);
  });

  it("fills profile privacy defaults", () => {
    const profile = profileSchema.parse({
      displayName: "Ari",
      bio: "Weekend climber",
      interests: ["coffee"],
      photos: ["https://cdn.example.com/ari.jpg"]
    });

    expect(profile.privacy.maximumDistanceKm).toBe(80);
  });
});
