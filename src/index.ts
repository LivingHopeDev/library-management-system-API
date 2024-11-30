import express from "express";
import config from "./config";
import cors from "cors";
import rootRouter from "./routes";
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

app.use("/api", rootRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
