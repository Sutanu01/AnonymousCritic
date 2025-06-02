import { z } from "zod";

export const UsernameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

export const PasswordValidation = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

export const EmailValidation = z
  .string()
  .email({ message: "Invalid email address" });



export const signUpSchema = z.object({
  username: UsernameValidation,
  email: EmailValidation,
  password: PasswordValidation,
});
