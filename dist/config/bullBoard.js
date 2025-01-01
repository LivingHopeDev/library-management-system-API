"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@bull-board/api");
const express_1 = require("@bull-board/express");
const queue_1 = require("../utils/queue");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const config_1 = __importDefault(require("../config"));
const ServerAdapter = new express_1.ExpressAdapter();
(0, api_1.createBullBoard)({
    queues: [new bullMQAdapter_1.BullMQAdapter(queue_1.emailQueue)],
    serverAdapter: ServerAdapter,
});
ServerAdapter.setBasePath(`/api/queues/${config_1.default.BULL_PASSKEY}`);
exports.default = ServerAdapter;
