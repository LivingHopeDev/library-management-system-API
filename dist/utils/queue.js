"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.addEmailToQueue = void 0;
const bullmq_1 = require("bullmq");
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("./logger"));
const sendMail_1 = require("./sendMail");
// Redis connection configuration
const connection = {
    host: config_1.default.REDIS_HOST,
    port: Number(config_1.default.REDIS_PORT),
    password: config_1.default.REDIS_PASSWORD,
};
// Retry settings and delay configuration
const retries = 2;
const delay = 1000 * 30; // 30 seconds delay between retries
// Create the email queue
const emailQueue = new bullmq_1.Queue("email-queue", { connection });
exports.emailQueue = emailQueue;
// Async handler for processing jobs with proper error handling
const asyncHandler = (fn) => {
    return (job) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fn(job);
        }
        catch (err) {
            logger_1.default.error("Error processing job", {
                jobId: job.id,
                error: err instanceof Error ? err.message : String(err),
            });
            const errorToReport = err instanceof Error ? err : new Error(String(err));
            yield job.moveToFailed(errorToReport, "Job failed due to an error");
            throw errorToReport;
        }
    });
};
// Function to add email jobs to the queue
const addEmailToQueue = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield emailQueue.add("email-job", data, {
            jobId: `email-${data.to}-${Date.now()}`,
            attempts: retries,
            backoff: {
                type: "fixed", // Fixed backoff strategy
                delay,
            },
        });
        return {
            status: true,
            message: "Email added to the queue successfully!",
        };
    }
    catch (error) {
        logger_1.default.error("Error adding email to queue", {
            error: error instanceof Error ? error.message : String(error),
            data,
        });
        return {
            status: false,
            message: error.message,
        };
    }
});
exports.addEmailToQueue = addEmailToQueue;
// Worker to process email jobs
const emailWorker = new bullmq_1.Worker("email-queue", // Queue name
asyncHandler((job) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendMail_1.Sendmail)(job.data); // Use the Sendmail function to send the email
    job.log(`Email sent successfully to ${job.data.to}`);
    logger_1.default.info({
        message: `Email sent to ${job.data.to}`,
        jobId: job.id,
        timestamp: new Date().toISOString(),
    });
})), {
    connection, // Redis connection configuration
    limiter: {
        max: 5, // Limit to 5 jobs processed at a time
        duration: 1000, // Limit to 5 jobs per second
    },
});
// Listen for job completion
emailWorker.on("completed", (job) => {
    logger_1.default.info(`Email job with id ${job.id} has been completed successfully`);
});
// Listen for job failure
emailWorker.on("failed", (job, error) => {
    logger_1.default.error(`Email job with id ${job.id} has failed with error: ${error.message}`);
});
