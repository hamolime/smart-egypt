import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import tripPlanRouter from "./tripplan";

const router: IRouter = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(tripPlanRouter);

export default router;
