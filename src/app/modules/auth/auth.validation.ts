import z from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z.string(),
      newPassword: z.string(),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: "Old password and new password should not be same",
      path: ["newPassword"],
    }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const authValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
