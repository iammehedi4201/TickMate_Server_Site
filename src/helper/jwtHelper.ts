import jwt, { Secret } from "jsonwebtoken";
import { TJWTPayload } from "../app/modules/auth/auth.interface";
import JwtError from "./errorHelper/jwtError";
import httpStatus from "http-status";

export const generateToken = (
  payLoad: TJWTPayload,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(payLoad, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

export const verifyToken = (token: string, secret: Secret): TJWTPayload => {
  const decoded = jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      throw new JwtError("Invalid Token", httpStatus.UNAUTHORIZED);
    }
    return decoded;
  });
  return decoded as unknown as TJWTPayload;
};
