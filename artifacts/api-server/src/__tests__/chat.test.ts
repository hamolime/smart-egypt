import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  // Attach a minimal pino-compatible logger to requests
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

describe("POST /chat", () => {
  let app: Express;

  beforeEach(async () => {
    vi.resetModules();
    mockCreate.mockReset();
    app = buildApp();
    const { default: chatRouter } = await import("../routes/chat");
    app.use(chatRouter);
  });

  it("should return 400 when messages is missing", async () => {
    const res = await request(app, "POST", "/chat", {});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "messages array is required" });
  });

  it("should return 400 when messages is not an array", async () => {
    const res = await request(app, "POST", "/chat", { messages: "not-array" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "messages array is required" });
  });

  it("should return AI reply on success", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "Hello from AI" } }],
    });

    const res = await request(app, "POST", "/chat", {
      messages: [{ role: "user", content: "Hi" }],
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ reply: "Hello from AI" });
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("should return fallback message when AI returns empty content", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const res = await request(app, "POST", "/chat", {
      messages: [{ role: "user", content: "Hi" }],
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      reply: "Sorry, I couldn't generate a response.",
    });
  });

  it("should return 500 when Groq API throws", async () => {
    mockCreate.mockRejectedValue(new Error("API down"));

    const res = await request(app, "POST", "/chat", {
      messages: [{ role: "user", content: "Hi" }],
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "AI service unavailable" });
  });
});
