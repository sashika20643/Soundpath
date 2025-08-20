
import { loginSchema, insertUserSchema } from "@shared/schema";

export const loginValidator = {
  body: loginSchema,
};

export const registerValidator = {
  body: insertUserSchema,
};
