import { config, documentClient } from "../../config/config";
const Log = require("@dazn/lambda-powertools-logger");

export const get = async (jobId: string) => {
  const params = {
    TableName: config.aws_table_name,
    KeyConditionExpression: "#jId = :jobId",
    ExpressionAttributeNames: {
      "#jId": "jobId",
    },
    ExpressionAttributeValues: {
      ":jobId": jobId,
    },
  };
  try {
    const response = await documentClient
      .query(params, (error, data) => {
        if (error) {
          Log.error(JSON.stringify(error, null, 2));
          return error;
        } else {
          return data.Items[0];
        }
      })
      .promise();

    return response.Items[0];
  } catch (error) {
    return error;
  }
};
