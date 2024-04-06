import catchAsync from "../../../Shared/catchAynsc";
import sendResponse from "../../../Shared/sendResponse";
import { TJWTPayload } from "./auth.interface";
import { authService } from "./auth.service";

//! Login user
const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  const { refreshToken } = result;
  //: set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

//! Refresh Token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: result,
  });
});

//! Change Password
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await authService.changePassword(
    user as TJWTPayload,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

//! Forgot Password
const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

//! Reset Password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await authService.resetPassword(req.body, token as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
