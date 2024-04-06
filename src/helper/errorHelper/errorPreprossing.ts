/* eslint-disable @typescript-eslint/no-explicit-any */
import handleZodError from "./handleZodErrror";
import AppError from "./appError";
import handleDuplicateError from "./handleDuplicateError";
import { ZodError } from "zod";
import JwtError from "./jwtError";
export const errorPreprossing = (err: any) => {
  //check if the error form zod
  if (err instanceof ZodError) {
    return handleZodError(err);
  } else if (err.code === "P2002") {
    return handleDuplicateError(err);
  } else if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      status: "error",
      message: "something went wrong",
      errorDetails: err.message,
      errorSource: null,
    };
  } else if (err instanceof JwtError) {
    return {
      statusCode: err.statusCode,
      status: "error",
      message: err.message || "Unauthorized Access",
    };
  } else if (err instanceof Error) {
    return {
      statusCode: 500,
      status: "error",
      message: err.name || "something went wrong",
      errorDetails: err.name ? err.name : err.message,
      errorSource: null,
    };
  }
};
