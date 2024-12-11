import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";

const handleZodError = (err: any) => {
  const formmatedMsg = err.issues.map(
    (el: { path: string; message: string }) => `${el.path[0]} - ${el.message}`
  );
  return new AppError(`Validation Error - ${formmatedMsg.join(". ")}`, 422);
};

const handleBadToken = () => {
  return new AppError("Unauthenticated user", 401);
};

const mongoCastError = (err: any) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 406);
};

const mongoDupError = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate value for ${value}`;
  return new AppError(msg, 409);
};

const mongoValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const msg = `Invalid data ${errors.join(". ")}`;
  return new AppError(msg, 422);
};

const handleErrorDev = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api/v1/portfolio")) {
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message, stack: err.stack });
  }
};

const handleErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  } else {
    console.error("ERROR 💥", err);
    res
      .status(err.statusCode)
      .json({ status: "error", message: "Something went wrong" });
  }
};

export default function globalError(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    handleErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    if (error.name === "ZodError") error = handleZodError(error);
    if (error.name === "CastError") error = mongoCastError(error);
    if (error.code == 11000) error = mongoDupError(error);
    if (error.name === "ValidationError") error = mongoValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleBadToken();
    handleErrorProd(error, res);
  }
}

export const wrongCredentials = () => {
  return new AppError("Login credentials do not match", 401);
};

export const notFound = (item: string) => {
  return new AppError(`${item} cannot be found`, 404);
};

export const unauthenticatedError = () => {
  return new AppError("email/password not found", 401);
};
export const unauthorizedError = () => {
  return new AppError("Access denied", 403);
};
