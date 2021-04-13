export const AWS = require("aws-sdk");

export const config = {
  aws_table_name: "Jobs-Table",
  aws_local_config: {
    region: "local",
    endpoint: "http://localhost:8000",
  },
  aws_remote_config: {},
};

AWS.config.update(config.aws_local_config);
export const documentClient = new AWS.DynamoDB.DocumentClient();
