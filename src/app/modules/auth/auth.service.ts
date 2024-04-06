import prisma from "../../../Shared/prisma";
import sendEmail from "../../../Shared/sendEmail";
import config from "../../../config/config";
import AppError from "../../../helper/errorHelper/appError";
import { generateToken, verifyToken } from "../../../helper/jwtHelper";
import { TChangePassword, TJWTPayload, TLoginUser } from "./auth.interface";
import bcypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import comparePasswordWithLastThreePasswords from "./auth.utils";

//! login user
const loginUser = async (payLoad: TLoginUser) => {
  const { email, password } = payLoad;

  //: check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: "ACTIVE",
    },
  });
  if (!user) {
    throw new AppError("user not found", 404);
  }

  //: check if password is correct
  const isPasswordCorrect = await bcypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("incorrect password", 400);
  }

  //: Create Access Token
  const jwtPayload = {
    email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.jwt_access_token_secret,
    config.jwt.jwt_access_token_expires_in
  );

  //:create refresh token
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt.jwt_refresh_token_secret,
    config.jwt.jwt_refresh_token_expires_in
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

//! Refresh Token
const refreshToken = async (refreshToken: string) => {
  //: verify refresh token
  const { email, role } = verifyToken(
    refreshToken,
    config.jwt.jwt_refresh_token_secret
  );

  //:check if user exists and status is active
  const user = await prisma.user.findUnique({
    where: {
      email,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError("user not found", 404);
  }

  //: Create Access Token
  const JwtPayload = {
    email,
    role,
  };

  const accessToken = generateToken(
    JwtPayload,
    config.jwt.jwt_access_token_secret,
    config.jwt.jwt_access_token_expires_in
  );

  return {
    accessToken,
  };
};

//! Change Password
const changePassword = async (user: TJWTPayload, payLoad: TChangePassword) => {
  const { email, role } = user;

  //: check if user exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
      status: "ACTIVE",
    },
  });

  if (!isUserExists) {
    throw new AppError("user not found", 404);
  }

  //: check  if old password is correct
  const isPasswordCorrect = await bcypt.compare(
    payLoad.oldPassword,
    isUserExists.password
  );

  if (!isPasswordCorrect) {
    throw new AppError("incorrect password", 400);
  }

  //: Get user last 3 Password History
  const passwordHistory = await prisma.passwordHistory.findMany({
    where: {
      userId: isUserExists.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  //: check if new password is in last three password and give date and time for last password change
  await comparePasswordWithLastThreePasswords(
    payLoad.newPassword,
    passwordHistory
  );

  //: hash new password
  const newHashedPassword = await bcypt.hash(
    payLoad.newPassword,
    Number(config.SaltRounds)
  );

  //:transaction to update password and add to password history
  await prisma.$transaction(async (transactionClient) => {
    //: update password
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: newHashedPassword,
      },
    });

    //: add password to password history
    await prisma.passwordHistory.create({
      data: {
        password: newHashedPassword,
        userId: isUserExists.id,
      },
    });
  });

  return {
    message: "password changed successfully",
  };
};

//! Forgot Password
const forgotPassword = async (payLoad: { email: string }) => {
  //: check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: payLoad.email,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError("user not found", 404);
  }

  //: create reset token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };
  const resetToken = generateToken(
    jwtPayload,
    config.jwt.reset_password_token_secret,
    config.jwt.reset_password_token_expires_in
  );

  console.log("resetToken", resetToken);

  //: reset password link
  const resetPasswordLink = `${config.reset_password_url_local}?email=${user.email}&token=${resetToken}`;

  //: send email
  const html = `
  <div>
   <p>Dear User,</p>
    <p> Click the link To Reset Password</p>
      <a href=${resetPasswordLink}>
        <button>
           Reset Password
        </button>
      </a>
   </p>
   </div>
  `;
  await sendEmail(user.email, html, "Reset Password");

  return {
    message: "reset password link sent to your email",
  };
};

//! Reset Password
const resetPassword = async (
  payLoad: {
    email: string;
    password: string;
  },
  token: string
) => {
  //:check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: payLoad.email,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError("user not found", 404);
  }

  //: verify token
  const decoded = verifyToken(token, config.jwt.reset_password_token_secret);

  //: check if user email and decoded email are same
  if (decoded.email !== user.email) {
    throw new AppError("invalid token", 400);
  }

  //: hash new password
  const newHashedPassword = await bcypt.hash(
    payLoad.password,
    Number(config.SaltRounds)
  );

  //: update Password in database
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: newHashedPassword,
    },
  });

  return {
    message: "password reset successfully",
  };
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
