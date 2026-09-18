import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 Characters"),
    email: z.string().email("Invalid Email format"),
    password: z.string().min(6, "Password must be 6 Characters")
})

export const loginSchema = z.object({
    email: z.string().email("Invalid Email format"),
    password: z.string().min(6, "Password is required")
})



