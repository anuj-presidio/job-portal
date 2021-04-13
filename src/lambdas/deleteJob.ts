const Log = require("@dazn/lambda-powertools-logger");
import { deleteJob } from "../data/deleteJob";
import {
  makeHandler,
  renderJson,
  renderError,
  renderNotFound,
} from "../../shared/handlers/middlewares";
import { get as getJob } from "../data/getJob";

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        jobId: {
          type: "string",
        },
      },
      additionalProperties: false,
      required: ["jobId"],
    },
  },
  required: ["body"],
};

const resolver = async ({ body }) => {
  const job = await getJob(body.jobId);
  if (!job) {
    return renderNotFound("Job not found");
  }

  try {
    await deleteJob(body.jobId);
  } catch (error) {
    return renderError(error);
  }
  Log.debug("job deleted", job);
  return renderJson({ statusCode: 202, body: job });
};

export const handler = makeHandler({ resolver, inputSchema });
