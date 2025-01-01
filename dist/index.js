"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const middlewares_1 = require("./middlewares");
const logger_1 = __importDefault(require("./utils/logger"));
const bullBoard_1 = __importDefault(require("./config/bullBoard"));
const swagger_ui_express_1 = require("swagger-ui-express");
const swaggerConfig_1 = __importDefault(require("./config/swaggerConfig"));
const app = (0, express_1.default)();
const port = config_1.default.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/api", (req, res) => {
    res.json({
        status: "success",
        message: "Welcome to library management system: I will be responding to your requests",
    });
});
app.use("/api/docs", swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swaggerConfig_1.default));
app.get("/api/queues/:passkey", (req, res) => {
    if (req.params.passkey !== process.env.BULL_PASSKEY) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    bullBoard_1.default.getRouter()(req, res);
});
app.use("/api", routes_1.default);
exports.prismaClient = new client_1.PrismaClient({
    log: ["query"],
});
app.use(middlewares_1.errorHandler);
app.use(middlewares_1.routeNotFound);
app.listen(port, () => {
    logger_1.default.info(`Server is listening on port ${port}`);
});
