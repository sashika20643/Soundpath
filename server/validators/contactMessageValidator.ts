import { z } from "zod";
import { insertContactMessageSchema } from "@shared/schema";

export const createContactMessageValidator = {
  body: insertContactMessageSchema,
};

export const getContactMessagesValidator = {
  query: z.object({}).optional(),
};