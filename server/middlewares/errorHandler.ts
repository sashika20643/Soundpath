import { Request, Response, NextFunction } from "express";
import { ResponseFormatter } from "../utils/responseFormatter";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = err;

  if (!err.isOperational) {
    statusCode = 500;
    message = "Something went wrong!";
  }

  const response = ResponseFormatter.error(message);
  
  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
