import { ZodError, ZodIssue } from "zod";
import {
  TErrorResponse,
  TErrorSource,
} from "../../app/middlewares/globalErrorHandlers";

const handleZodError = (err: ZodError): TErrorResponse => {
  //error source
  const errorSource: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path as string[],
      message: issue?.message,
    };
  });
  //error details
  const errorDetails = errorSource
    .map((error) => `${error.path[error.path.length - 1]} is ${error.message}`)
    .join(" . ");
  return {
    statusCode: 400,
    status: "error",
    message: "validation Error",
    errorDetails: errorDetails,
    errorSource,
  };
};

export default handleZodError;
