import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";

vi.mock("@workspace/api-zod", () => ({
  HealthCheckResponse: {
    parse: (data: unknown) => data,
  },
}));

describe("GET /healthz", () => {
  let app: express.Express;

  beforeEach(async () => {
    const { default: healthRouter } = await import("../routes/health");
    app = express();
    app.use(healthRouter);
  });

  it("should return { status: 'ok' } with 200", async () => {
    const res = await makeRequest(app, "/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

async function makeRequest(app: express.Express, path: string) {
  const { createServer } = await import("http");
  return new Promise<{ status: number; body: unknown }>((resolve, reject) => {
    const server = createServer(app);
    server.listen(0, () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        server.close();
        return reject(new Error("Could not get address"));
      }
      fetch(`http://127.0.0.1:${addr.port}${path}`)
        .then(async (res) => {
          const body = await res.json();
          server.close();
          resolve({ status: res.status, body });
        })
        .catch((err) => {
          server.close();
          reject(err);
        });
    });
  });
}
