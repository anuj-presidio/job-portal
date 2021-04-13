import { config, documentClient } from "../../config/config";
const Log = require("@dazn/lambda-powertools-logger");
// TODO
// to implement pagination
export const get = async () => {
  var results = [];
  const params = {
    TableName: config.aws_table_name,
  };

  try {
    await documentClient.scan(params, onScan).promise();
  } catch (error) {
    return error;
  }

  function onScan(err, data) {
    if (err) {
      Log.error(JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(function (itemdata) {
        results.push(itemdata);
      });
      // continue scanning if we have more items
      if (typeof data.LastEvaluatedKey != "undefined") {
        params["ExclusiveStartKey"] = data.LastEvaluatedKey;
        documentClient.scan(params, onScan);
      }
    }
  }
  return results;
};
