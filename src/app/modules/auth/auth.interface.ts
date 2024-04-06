import { UserRole } from "@prisma/client";

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJWTPayload = {
  email: string;
  role: UserRole;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};
