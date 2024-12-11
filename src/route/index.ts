import { Request, Response, Router } from "express";
import authRouter from "./auth.router";
import taskRouter from "./task.router";
import { authenticate } from "../controller/authenticate";
import profileRouter from "./profile.routes";

const router = Router();

router.use("/auth", authRouter);
router.use('/profile',authenticate, profileRouter)
router.use("/task", authenticate, taskRouter);

export default router;
