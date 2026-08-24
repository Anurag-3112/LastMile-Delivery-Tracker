const { z } = require("zod");

const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name is too long"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .transform((value) => value.toLowerCase()),

    phone: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, "Phone number must contain 10 digits"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .transform((value) => value.toLowerCase()),

    password: z.string().min(1, "Password is required"),
});

module.exports = {
    registerSchema,
    loginSchema,
};