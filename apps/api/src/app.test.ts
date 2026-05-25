import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app";

describe("api app", () => {
  it("returns health", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
