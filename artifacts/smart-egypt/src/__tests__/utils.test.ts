import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("should handle conditional classes via clsx", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("should resolve tailwind conflicts (last wins)", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("should handle undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("should handle empty string", () => {
    expect(cn("")).toBe("");
  });

  it("should handle no arguments", () => {
    expect(cn()).toBe("");
  });

  it("should handle array inputs", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });

  it("should handle object inputs", () => {
    expect(cn({ "px-2": true, "py-1": false, "mt-4": true })).toBe("px-2 mt-4");
  });
});
