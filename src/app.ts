import Express, { Application, Response, Request } from "express";
import cors from "cors";
import router from "./app/routes/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import cookieParser from "cookie-parser";
import prisma from "./Shared/prisma";

const app: Application = Express();

//! Middleware
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cors());

//:parser
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Ph Health Care Sever!");
});

//! Routes Middleware
app.use("/api/v1", router);

//! Error Handler Middleware
app.use(globalErrorHandler);

//! Not Found Route middleware
app.use(notFoundHandler);

export default app;
