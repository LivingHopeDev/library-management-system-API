import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "../utils/queue";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import config from "../config";

const ServerAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter: ServerAdapter,
});

ServerAdapter.setBasePath(`/api/queues/${config.BULL_PASSKEY}`);
export default ServerAdapter;
