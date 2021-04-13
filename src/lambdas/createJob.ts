import Log from "@dazn/lambda-powertools-logger";
import { makeHandler, renderJson } from "../../shared/handlers/middlewares";
import { create } from "../data/createJob";
import { Job } from "../entities/Job";
import * as schema from "../../shared/types/types.schema.json";

const inputSchema = {
  definitions: schema.definitions,
  type: "object",
  properties: {
    body: {
      type: "object",
      ...schema.definitions["Job.IJob"],
      required: [...schema.definitions["Job.IJob"].required],
      additionalProperties: false,
    },
  },
  required: ["body"],
};

const resolver = async ({ body: job }) => {
  const payload = new Job(job);
  if (payload.validate()) {
    try {
      await create(payload);
    } catch (error) {
      Log.debug(error);
      throw error;
    }
  } else {
    return {
      statusCode: 400,
      code: "error/Bad request",
      message: "Invalid/Incorrect Job details",
    };
  }

  return renderJson({
    statusCode: 201,
    body: {
      message: "Job created.",
      payload,
    },
  });
};

export const handler = makeHandler({ resolver, inputSchema });
