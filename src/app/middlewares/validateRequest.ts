import { AnyZodObject } from "zod";
import catchAsync from "../../Shared/catchAynsc";

const ValidateRequest = (Schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await Schema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default ValidateRequest;
