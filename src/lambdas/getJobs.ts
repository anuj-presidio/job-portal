import { get } from "../data/getJobs";
const Log = require("@dazn/lambda-powertools-logger");
import {
  makeHandler,
  renderJson,
  renderError,
  renderNotFound,
} from "../../shared/handlers/middlewares";

const inputSchema = {
  type: "object",
  properties: {},
};

const resolver = async () => {
  try {
    let jobs = await get();
    if (!jobs) return renderNotFound();
    Log.debug("Jobs retreived", jobs);
    return renderJson({ statusCode: 200, body: jobs });
  } catch (error) {
    return renderError(error);
  }
};

export const handler = makeHandler({ resolver, inputSchema });
