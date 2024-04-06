/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { errorPreprossing } from "../../helper/errorHelper/errorPreprossing";
export type TErrorSource = {
  path: string[] | string;
  message: string;
}[];

export type TErrorResponse = {
  statusCode: number;
  status: "error";
  message: string;
  errorDetails: string;
  errorSource: TErrorSource | null;
  stack?: any;
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let errorResponse: TErrorResponse = {
    statusCode: err.statusCode || 500,
    status: "error",
    message: err.message || "something went wrong",
    errorDetails: err.message || "something went wrong",
    errorSource: [
      {
        path: [],
        message: "something went wrong",
      },
    ],
  };

  //error preprossing
  errorResponse = errorPreprossing(err) as TErrorResponse;

  //Ultimately we will send this errorReponse to the client
  return res.status(errorResponse.statusCode).json({
    status: errorResponse.status,
    message: errorResponse.message,
    errorDetails: errorResponse.errorDetails,
    errorSource: errorResponse.errorSource,
    err,
    // stack:
    //   config.node_env === "production" || errorResponse.stack === null
    //     ? null
    //     : err?.stack,
  });
};
