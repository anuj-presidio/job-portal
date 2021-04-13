import XRay from "aws-xray-sdk-core";
import { Context, Callback } from "aws-lambda";
import validator from "@middy/validator";
import jsonBodyParser from "@middy/http-json-body-parser";
import secretsManager from "@middy/secrets-manager";
import middy, { SQSHandler } from "@dazn/lambda-powertools-pattern-basic";
import Log from "@dazn/lambda-powertools-logger";

export interface IResponse {
  statusCode: number;
  body?: string;
}

export const errorHandler = () => {
  return {
    onError: (handler, next) => {
      // if there are a `statusCode` and an `error` field
      // this is a valid http error object
      if (handler.error.statusCode && handler.error.message) {
        Log.error(handler.error);
        if (/validation/.exec(handler.error.message)) {
          handler.response = {
            statusCode: handler.error.statusCode,
            body: JSON.stringify({
              message: handler.error.message,
              details: handler.error.details,
            }),
          };
        } else {
          handler.response = {
            statusCode: handler.error.statusCode,
            body: JSON.stringify({ message: handler.error.message }),
          };
        }
        return next();
      }
      return next(handler.error);
    },
  };
};

/**
 * The middy function injects .env.local data into secrets context used in Function Handlers.
 */
export const offlineSecrets = () => {
  // might set default options in config
  return {
    before: (handler, next) => {
      // Attaches values only for OFFLINE state
      if (process.env.IS_OFFLINE) {
        handler.context["secrets"] = {};
      }
      next();
    },
  };
};

/**
 * Middy middleware that adds xray to aws-sdk
 */
let isXRayInitialized: boolean = false;
const xrayMiddleware = () => {
  return {
    before: (_, next) => {
      if (!process.env.IS_OFFLINE && !isXRayInitialized) {
        isXRayInitialized = true;
        XRay.captureAWS(require("aws-sdk"));
      }
      next();
    },
  };
};

export const secretsMiddleware = () => {
  return process.env.IS_OFFLINE
    ? offlineSecrets()
    : secretsManager({
        cache: true,
        cacheExpiryInMillis: 1000 * 60 * 5, // 5 mins
        throwOnFailedCall: true,
        secrets: {
          secrets: process.env.SECRET_ARN,
        },
      });
};

type AsyncHandler<C extends Context> =
  | ((event: any, context: C, callback: Callback<any>) => void)
  | ((event: any, context: C) => Promise<any>);

export interface PlatformContext extends Context {
  secrets: Record<string, any>;
}

interface IMakeHandlerInput {
  resolver: AsyncHandler<PlatformContext> | SQSHandler;
  inputSchema?: Record<string, any>;
  initSecrets?: boolean;
  jsonParser?: boolean;
}

export const makeHandler = ({
  resolver,
  inputSchema = null,
  initSecrets = false,
  jsonParser = true,
}: IMakeHandlerInput) => {
  const middyObject = middy(resolver);

  if (!process.env.IS_OFFLINE) {
    middyObject.use(xrayMiddleware());
  }

  if (jsonParser) {
    middyObject.use(jsonBodyParser());
  }

  if (inputSchema) {
    middyObject.use(validator({ inputSchema }));
  }
  if (initSecrets) {
    middyObject.use(secretsMiddleware());
  }

  middyObject.use(errorHandler());
  return middyObject;
};

export interface RenderErrorInput {
  statusCode: number;
  error?: Error;
  code?: string;
  message?: string;
}

export const renderError = ({
  error,
  statusCode,
  code,
  message,
}: RenderErrorInput): IResponse => {
  const body: Record<string, any> = {};
  Log.error(message, error);
  if (code) {
    body.code = code;
  }
  if (message) {
    body.message = message;
  }
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

export const renderNotFound = (msg?: string) => {
  const message = msg ? msg : "Not found";
  Log.debug(`rendering 404 with message "${message}"`);
  return renderError({
    statusCode: 404,
    code: "error/not-found",
    message,
  });
};

export interface IRenderJsonInput {
  statusCode?: number;
  body: Record<string, any>;
}

export const renderJson = ({ statusCode = 200, body }: IRenderJsonInput) => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};
