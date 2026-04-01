import { z} from "zod";

const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.errors
            });
        }
        req.body = result.data;
        next();
    };
};

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(3, "Password must be at least 3 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(3, "Password must be at least 3 characters"),
});

export { registerSchema, loginSchema, validateRequest };
