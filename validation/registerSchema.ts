import { z } from "zod";
import { name, email, phone, password, password_confirmation } from "./common";

export const registerSchema = z
  .object({
    name,
    email,
    phone,
    password,
    password_confirmation
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });
