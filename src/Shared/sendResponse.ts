import { Response } from "express";

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | T[] | null | undefined;
  meta?:
    | {
        page: number;
        limit: number;
        totalData: number;
      }
    | null
    | undefined;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  return res.status(data.statusCode).json(data);
};

export default sendResponse;
