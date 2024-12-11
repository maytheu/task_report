import "dotenv/config";
import { createServer } from "http";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/validate";
import router from "./route";
import AppError from "./config/AppError";
import globalError from "./controller/globalError";
import Db from "./config/Db";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";

const port = env.PORT;
const app = express();

// middleware
const limiter = rateLimit({
  windowMs: 100 * 60 * 1000,
  max: 500,
  message: "Too many request",
});
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(ExpressMongoSanitize());  
app.use(hpp());

// route
app.get("/", (req: Request, res: Response) =>
  res.redirect("https://documenter.getpostman.com/view/8279131/2sA3dxDreT")
);
app.use("/api/v1", router);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(`Ooops.. ${req.originalUrl} not found on this server`, 404)
  );
});
app.use(globalError);

const httpServer = createServer(app);
const startServer = async () => {
  await Db.connectMongo();
  httpServer.listen(port, () => console.log(`Server started on port ${port}`));
};

startServer();
