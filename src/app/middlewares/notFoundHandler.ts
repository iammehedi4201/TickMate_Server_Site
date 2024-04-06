import { NextFunction, Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Api Not Found",
    errorDetails: {
      path: req.originalUrl,
      message: "Api Not Found",
    },
  });
};

export default notFoundHandler;
