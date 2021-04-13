import { get } from "../data/getJob";
const Log = require("@dazn/lambda-powertools-logger");
import {
  makeHandler,
  renderJson,
  renderError,
  renderNotFound,
} from "../../shared/handlers/middlewares";
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
  try {
    Log.debug(body);
    const job = await get(body.jobId);
    if (!job) return renderNotFound("Job not found");
    Log.debug("Job found", job);

    return renderJson({ statusCode: 200, body: job });
  } catch (error) {
    return renderError(error);
  }
};

export const handler = makeHandler({ resolver, inputSchema });
