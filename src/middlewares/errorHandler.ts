import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError.js"

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message })
    }

    console.log("Unexpected Error:", err)
    return res.status(500).json({ error: "Something Went Wrong" })
}