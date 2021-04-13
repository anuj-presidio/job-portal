import { config, documentClient } from "../../config/config";
const Log = require("@dazn/lambda-powertools-logger");
import { Job } from "../entities/Job";

export const create = async (job: Job) => {
  const data = {
    TableName: config.aws_table_name,
    Item: job.toItem(),
  };
  try {
    await documentClient.put(data).promise();
  } catch (error) {
    Log.error(JSON.stringify(error));
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  Log.debug("Job created", job);
  return job;
};
