import { UserRole } from "@prisma/client";
import catchAsync from "../../Shared/catchAynsc";
import AppError from "../../helper/errorHelper/appError";
import { verifyToken } from "../../helper/jwtHelper";
import config from "../../config/config";
import prisma from "../../Shared/prisma";
import JwtError from "../../helper/errorHelper/jwtError";
import httpStatus from "http-status";

const checkAuth = (...roles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization as string;

    if (!token) {
      throw new JwtError("Token not found", httpStatus.UNAUTHORIZED);
    }

    //: verify token
    const decoded = verifyToken(token, config.jwt.jwt_access_token_secret);

    const { email, role } = decoded;

    //: check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
        status: "ACTIVE",
      },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    //: check if user role is allowed to access the route
    if (roles.length && !roles.includes(role)) {
      throw new JwtError("UnAuthorized Access", httpStatus.UNAUTHORIZED);
    }

    //: set user in request object
    req.user = decoded;
    next();
  });
};

export default checkAuth;
