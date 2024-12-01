import { Queue, Job, Worker } from "bullmq";
import config from "../config";
import log from "./logger";
import { Sendmail } from "./sendMail";

// Redis connection configuration
const connection = {
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
  password: config.REDIS_PASSWORD,
};

// Retry settings and delay configuration
const retries: number = 2;
const delay: number = 1000 * 30; // 30 seconds delay between retries

// Create the email queue
const emailQueue = new Queue("email-queue", { connection });

// Define the structure of the email job data
interface EmailJobData {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Async handler for processing jobs with proper error handling
const asyncHandler = (fn: (job: Job) => Promise<void>) => {
  return async (job: Job) => {
    try {
      await fn(job);
    } catch (err) {
      log.error("Error processing job", {
        jobId: job.id,
        error: err instanceof Error ? err.message : String(err),
      });
      const errorToReport = err instanceof Error ? err : new Error(String(err));
      await job.moveToFailed(errorToReport, "Job failed due to an error");
      throw errorToReport;
    }
  };
};

// Function to add email jobs to the queue
const addEmailToQueue = async (data: EmailJobData) => {
  try {
    await emailQueue.add("email-job", data, {
      jobId: `email-${data.to}-${Date.now()}`,
      attempts: retries, // Retry 2 times
      backoff: {
        type: "fixed", // Fixed backoff strategy
        delay, // Retry delay of 30 seconds
      },
    });

    return {
      status: true,
      message: "Email added to the queue successfully!",
    };
  } catch (error) {
    log.error("Error adding email to queue", {
      error: error instanceof Error ? error.message : String(error),
      data,
    });
    return {
      status: false,
      message: error.message,
    };
  }
};

// Worker to process email jobs
const emailWorker = new Worker(
  "email-queue", // Queue name
  asyncHandler(async (job: Job) => {
    await Sendmail(job.data); // Use the Sendmail function to send the email
    job.log(`Email sent successfully to ${job.data.to}`);
    log.info({
      message: `Email sent to ${job.data.to}`,
      jobId: job.id,
      timestamp: new Date().toISOString(),
    });
  }),
  {
    connection, // Redis connection configuration
    limiter: {
      max: 5, // Limit to 5 jobs processed at a time
      duration: 1000, // Limit to 5 jobs per second
    },
  }
);

// Listen for job completion
emailWorker.on("completed", (job) => {
  log.info(`Email job with id ${job.id} has been completed successfully`);
});

// Listen for job failure
emailWorker.on("failed", (job, error) => {
  log.error(
    `Email job with id ${job.id} has failed with error: ${error.message}`
  );
});

export { addEmailToQueue, emailQueue };
