import type { Request, Response, NextFunction } from "express"
import { ZodObject } from "zod"
import { AppError } from "../utils/AppError.js"

export const validate = (schema: ZodObject) => {
    return (
        (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const message = result.error.issues.map((i: any) => (i.message)).join(", ")
                return (
                    next(new AppError(message, 400))
                )
            }
            req.body = result.data
            next()
        }
    )
}
