import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";

const mockCreate = vi.fn();

vi.mock("groq-sdk", () => ({
  default: class Groq {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  },
}));

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).log = { error: vi.fn(), info: vi.fn() };
    next();
  });
  return app;
}

async function request(
  app: Express,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const server: Server = createServer(app);
    server.listen(0, () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        server.close();
        return reject(new Error("Could not get address"));
      }
      const url = `http://127.0.0.1:${addr.port}${path}`;
      const opts: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (body !== undefined) opts.body = JSON.stringify(body);
      fetch(url, opts)
        .then(async (res) => {
          const json = await res.json();
          server.close();
          resolve({ status: res.status, body: json });
        })
        .catch((err) => {
          server.close();
          reject(err);
        });
    });
  });
}

describe("POST /trip-plan", () => {
  let app: Express;

  beforeEach(async () => {
    vi.resetModules();
    mockCreate.mockReset();
    app = buildApp();
    const { default: tripPlanRouter } = await import("../routes/tripplan");
    app.use(tripPlanRouter);
  });

  it("should return 400 when destination is missing", async () => {
    const res = await request(app, "POST", "/trip-plan", { days: 3 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "destination and days are required",
    });
  });

  it("should return 400 when days is missing", async () => {
    const res = await request(app, "POST", "/trip-plan", {
      destination: "Cairo",
    });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "destination and days are required",
    });
  });

  it("should return itinerary on success", async () => {
    const mockItinerary = [
      {
        day: 1,
        title: "Arrival in Cairo",
        morning: "Hotel check-in",
        afternoon: "Visit Khan el-Khalili",
        evening: "Nile dinner cruise",
        tip: "Bargain at the bazaar",
      },
    ];

    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockItinerary) } }],
    });

    const res = await request(app, "POST", "/trip-plan", {
      destination: "Cairo",
      days: 1,
      budget: "moderate",
      interests: ["history"],
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ itinerary: mockItinerary });
  });

  it("should return 500 when AI returns non-JSON", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "Here is your plan..." } }],
    });

    const res = await request(app, "POST", "/trip-plan", {
      destination: "Luxor",
      days: 2,
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to parse itinerary" });
  });

  it("should return 500 when Groq API throws", async () => {
    mockCreate.mockRejectedValue(new Error("Service down"));

    const res = await request(app, "POST", "/trip-plan", {
      destination: "Aswan",
      days: 3,
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to generate trip plan" });
  });

  it("should handle language parameter for Arabic", async () => {
    const mockItinerary = [{ day: 1, title: "يوم الوصول" }];
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockItinerary) } }],
    });

    const res = await request(app, "POST", "/trip-plan", {
      destination: "Cairo",
      days: 1,
      language: "ar",
    });

    expect(res.status).toBe(200);
    // Verify the prompt includes Arabic instruction
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages[0].content).toContain("Respond entirely in Arabic");
  });

  it("should handle language parameter for French", async () => {
    const mockItinerary = [{ day: 1, title: "Jour d'arrivée" }];
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockItinerary) } }],
    });

    const res = await request(app, "POST", "/trip-plan", {
      destination: "Cairo",
      days: 1,
      language: "fr",
    });

    expect(res.status).toBe(200);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages[0].content).toContain("Respond entirely in French");
  });

  it("should default to English when no language is specified", async () => {
    const mockItinerary = [{ day: 1, title: "Arrival" }];
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockItinerary) } }],
    });

    const res = await request(app, "POST", "/trip-plan", {
      destination: "Cairo",
      days: 1,
    });

    expect(res.status).toBe(200);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.messages[0].content).toContain("Respond entirely in English");
  });
});
