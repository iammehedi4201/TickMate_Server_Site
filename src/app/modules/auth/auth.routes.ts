import express from "express";
import ValidateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

//! Login user route
router.post(
  "/login",
  ValidateRequest(authValidation.loginValidationSchema),
  authController.loginUser
);

//! Refresh Token route
router.post("/refresh-token", authController.refreshToken);

//! Change Password route
router.post(
  "/change-password",
  checkAuth("ADMIN", "DOCTOR", "PATIENT", "SUPER_ADMIN"),
  ValidateRequest(authValidation.changePasswordValidationSchema),
  authController.changePassword
);

//! Forgot Password route
router.post(
  "/forgot-password",
  ValidateRequest(authValidation.forgotPasswordValidationSchema),
  authController.forgotPassword
);

//! Reset Password route
router.post(
  "/reset-password",
  ValidateRequest(authValidation.resetPasswordValidationSchema),
  authController.resetPassword
);

export const authRoutes = router;
