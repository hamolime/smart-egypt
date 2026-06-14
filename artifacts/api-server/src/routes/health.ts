import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (req, res) => {
  const result = HealthCheckResponse.safeParse({ status: "ok" });
  if (!result.success) {
    req.log.error({ issues: result.error.issues }, "Health check schema validation failed");
    res.status(500).json({ error: "Internal validation error" });
    return;
  }
  res.json(result.data);
});

export default router;
