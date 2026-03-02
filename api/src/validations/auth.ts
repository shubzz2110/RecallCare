import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const setPasswordSchema = z.object({
  password: z.string(),
  token: z.string(),
});
