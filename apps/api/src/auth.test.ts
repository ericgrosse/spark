import { describe, expect, it } from "vitest";
import { hashPassword, signSession, verifyPassword } from "./auth";

describe("auth security", () => {
  it("hashes and verifies passwords without storing the raw secret", async () => {
    const password = "StrongPass!123";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await verifyPassword(hash, password)).toBe(true);
    expect(await verifyPassword(hash, "WrongPass!123")).toBe(false);
  });

  it("signs a session token", () => {
    const token = signSession({ id: "user-1", role: "USER" });

    expect(token.split(".")).toHaveLength(3);
  });
});
