import { AWS } from "../../config/config";
import { config } from "../../config/config";
AWS.config.update(config.aws_local_config);
import * as Table from "../../config/tables/create-table.json";
const Log = require("@dazn/lambda-powertools-logger");
const dynamodb = new AWS.DynamoDB();

async function resetTable() {
  try {
    await dynamodb
      .deleteTable({
        TableName: config.aws_table_name,
      })
      .promise();
    Log.debug("table deleted");
  } catch (error) {
    Log.error("error while deleting table", error);
  }

  try {
    await dynamodb.createTable(Table.Table).promise();
    Log.debug("table created");
  } catch (error) {
    Log.error("error while creating table", error);
  }
}

export default resetTable;
