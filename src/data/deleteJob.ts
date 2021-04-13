import { config, documentClient } from "../../config/config";
const Log = require("@dazn/lambda-powertools-logger");

export const deleteJob = async (jobId) => {
  const jobObject = {
    Key: {
      jobId,
    },
    TableName: config.aws_table_name,
  };

  try {
    await documentClient
      .delete(jobObject, (err, data) => {
        if (err) {
          Log.error(JSON.stringify(err, null, 2));
          return {
            statusCode: err.statusCode,
            message: err.message,
          };
        } else {
          return data;
        }
      })
      .promise();
  } catch (error) {
    return error;
  }
};
