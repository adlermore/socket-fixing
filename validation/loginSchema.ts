import { z } from "zod";
import { email } from "./common";

export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(1, { message: "This field is required" })
    .max(50, { message: "Field must be at most 50 characters long" })
    .trim()
    .refine((val: string) => val.length > 0, {
      message: "Field cannot be empty or just spaces",
    }),

});
