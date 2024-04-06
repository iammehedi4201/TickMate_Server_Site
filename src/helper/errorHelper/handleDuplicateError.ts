import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const handleDuplicateError = (err: PrismaClientKnownRequestError) => {
  return {
    statusCode: 400,
    status: "error",
    message: "Validation Error",
    errorDetails: (err?.meta?.target as string[])
      .map((target: any) => {
        return `${target} is already taken`;
      })
      .join(" . "),
    errorSource: (err?.meta?.target as string[]).map((target) => {
      return {
        path: [target],
        message: `${target} is already taken`,
      };
    }),
  };
};

export default handleDuplicateError;
