import express from "express";
import config from "./config";
import cors from "cors";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorHandler, routeNotFound } from "./middlewares";
import log from "./utils/logger";
import ServerAdapter from "./config/bullBoard";
import { Request, Response } from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerSpec from "./config/swaggerConfig";

const app = express();
const port = config.PORT;
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    status: "success",
    message:
      "Welcome to library management system: I will be responding to your requests",
  });
});

app.use("/api/docs", serve, setup(swaggerSpec));
app.get("/api/queues/:passkey", (req: Request, res: Response) => {
  if (req.params.passkey !== process.env.BULL_PASSKEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  ServerAdapter.getRouter()(req, res);
});
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorHandler);
app.use(routeNotFound);
app.listen(port, () => {
  log.info(`Server is listening on port ${port}`);
});
