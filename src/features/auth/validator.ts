import { z } from 'zod';

// Define the User schema using Zod
export const UserSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

// Schema for user login
export const UserLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});
