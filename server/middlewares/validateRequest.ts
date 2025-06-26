import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ResponseFormatter } from "../utils/responseFormatter";

export const validateRequest = (schema: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string[]> = {};

    // Validate body
    if (schema.body) {
      try {
        req.body = schema.body.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.body = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        }
      }
    }

    // Validate params
    if (schema.params) {
      try {
        req.params = schema.params.parse(req.params);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.params = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        }
      }
    }

    // Validate query
    if (schema.query) {
      try {
        req.query = schema.query.parse(req.query);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.query = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(ResponseFormatter.validationError(errors));
    }

    next();
  };
};
