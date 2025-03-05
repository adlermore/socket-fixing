import { z } from "zod";
import { email, password } from "./common";

export const loginSchema = z.object({
  email,
  password
});
