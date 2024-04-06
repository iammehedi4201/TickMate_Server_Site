import { Request } from "express";
import { TJWTPayload } from "../modules/auth/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: TJWTPayload;
    }
  }
}
