import { describe, expect, it } from "vitest";
import request from "supertest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createApp } from "./app";

describe("api app", () => {
  it("returns health", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it("rejects invalid registration input before touching persistence", async () => {
    const response = await request(createApp()).post("/auth/register").send({
      email: "not-an-email",
      password: "weak",
      displayName: "A",
      birthDate: "not-a-date"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid input.");
  });

  it("rate limits excessive requests", async () => {
    const app = createApp();
    let response = await request(app).get("/health");

    for (let i = 0; i < 121; i += 1) {
      response = await request(app).get("/health");
    }

    expect(response.status).toBe(429);
  });

  it("exposes blocking and reporting routes", () => {
    const source = readFileSync(resolve("src/app.ts"), "utf8");

    expect(source).toContain('app.post("/blocks/:userId"');
    expect(source).toContain('app.post("/reports"');
    expect(source).toContain("validateBody(reportSchema)");
  });
});
