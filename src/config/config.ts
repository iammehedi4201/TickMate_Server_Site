import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
import path from "path";

//: Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV as string,
  port: process.env.PORT as string,
  SaltRounds: process.env.SALT_ROUNDS,
  jwt: {
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET as Secret,
    jwt_access_token_expires_in: process.env
      .JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET as Secret,
    jwt_refresh_token_expires_in: process.env
      .JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    reset_password_token_secret: process.env.RESET_TOKEN_SECRET as Secret,
    reset_password_token_expires_in: process.env
      .RESET_TOKEN_EXPIRES_IN as string,
  },
  reset_password_url_local: process.env.RESET_PASS_URL_LOCAL,
  sendEmail: {
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD,
    email_service: process.env.EMAIL_SERVICE,
  },
};
