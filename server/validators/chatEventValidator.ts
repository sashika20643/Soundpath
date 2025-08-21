import { z } from "zod";

export const chatEventValidator = {
  body: z.object({
    userQuery: z.string().min(1, "User query is required"),
    limit: z.number().optional().default(5), // how many events to return
  }),
};
