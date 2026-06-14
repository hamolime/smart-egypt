import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  customFetch,
  setBaseUrl,
  setAuthTokenGetter,
  ApiError,
  ResponseParseError,
} from "../custom-fetch";

describe("custom-fetch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    setBaseUrl(null);
    setAuthTokenGetter(null);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("setBaseUrl", () => {
    it("should prepend base URL to relative paths", async () => {
      setBaseUrl("https://api.example.com");

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("/api/health");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.example.com/api/health",
        expect.any(Object),
      );
    });

    it("should not modify absolute URLs", async () => {
      setBaseUrl("https://api.example.com");

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://other.com/path");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://other.com/path",
        expect.any(Object),
      );
    });

    it("should strip trailing slashes from base URL", async () => {
      setBaseUrl("https://api.example.com///");

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(null, { status: 204 }),
      );

      await customFetch("/test");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.any(Object),
      );
    });
  });

  describe("setAuthTokenGetter", () => {
    it("should attach Authorization header when getter returns a token", async () => {
      setAuthTokenGetter(() => "my-token-123");

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://api.com/data");

      const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(new Headers(callHeaders).get("authorization")).toBe(
        "Bearer my-token-123",
      );
    });

    it("should not attach header when getter returns null", async () => {
      setAuthTokenGetter(() => null);

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://api.com/data");

      const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(new Headers(callHeaders).has("authorization")).toBe(false);
    });

    it("should not overwrite explicit Authorization header", async () => {
      setAuthTokenGetter(() => "auto-token");

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://api.com/data", {
        headers: { Authorization: "Bearer manual-token" },
      });

      const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(new Headers(callHeaders).get("authorization")).toBe(
        "Bearer manual-token",
      );
    });
  });

  describe("request method handling", () => {
    it("should throw when body is provided for GET request", async () => {
      await expect(
        customFetch("https://api.com/data", {
          method: "GET",
          body: "some-body",
        }),
      ).rejects.toThrow("GET requests cannot have a body");
    });

    it("should throw when body is provided for HEAD request", async () => {
      await expect(
        customFetch("https://api.com/data", {
          method: "HEAD",
          body: "some-body",
        }),
      ).rejects.toThrow("HEAD requests cannot have a body");
    });

    it("should default to GET method", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://api.com/data");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.com/data",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("content-type auto-detection", () => {
    it("should auto-set content-type to application/json for JSON-like body", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://api.com/data", {
        method: "POST",
        body: '{"key": "value"}',
      });

      const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(new Headers(callHeaders).get("content-type")).toBe(
        "application/json",
      );
    });

    it("should not set content-type when body is not JSON-like", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("ok", { status: 200 }),
      );

      await customFetch("https://api.com/data", {
        method: "POST",
        body: "plain text body",
      });

      const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(new Headers(callHeaders).has("content-type")).toBe(false);
    });
  });

  describe("response parsing", () => {
    it("should return null for 204 No Content", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(null, { status: 204 }),
      );

      const result = await customFetch("https://api.com/data");
      expect(result).toBeNull();
    });

    it("should parse JSON response", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: "hello" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      const result = await customFetch("https://api.com/data");
      expect(result).toEqual({ data: "hello" });
    });

    it("should return text for text responses", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("plain text", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      );

      const result = await customFetch("https://api.com/data");
      expect(result).toBe("plain text");
    });

    it("should return null for empty text response", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      );

      const result = await customFetch("https://api.com/data");
      expect(result).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should throw ApiError for non-OK responses", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          statusText: "Not Found",
          headers: { "content-type": "application/json" },
        }),
      );

      await expect(
        customFetch("https://api.com/data"),
      ).rejects.toBeInstanceOf(ApiError);
    });

    it("should include status and data in ApiError", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Forbidden" }), {
          status: 403,
          statusText: "Forbidden",
          headers: { "content-type": "application/json" },
        }),
      );

      try {
        await customFetch("https://api.com/data");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiErr = err as ApiError;
        expect(apiErr.status).toBe(403);
        expect(apiErr.data).toEqual({ message: "Forbidden" });
        expect(apiErr.method).toBe("GET");
      }
    });

    it("should throw ResponseParseError for invalid JSON response", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("not valid json", {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await expect(
        customFetch("https://api.com/data", { responseType: "json" }),
      ).rejects.toBeInstanceOf(ResponseParseError);
    });
  });

  describe("responseType option", () => {
    it("should respect responseType=json and set accept header", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ x: 1 }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

      await customFetch("https://api.com/data", { responseType: "json" });

      const callHeaders = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(new Headers(callHeaders).get("accept")).toContain(
        "application/json",
      );
    });

    it("should respect responseType=text", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response("text content", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }),
      );

      const result = await customFetch("https://api.com/data", {
        responseType: "text",
      });
      expect(result).toBe("text content");
    });
  });
});
