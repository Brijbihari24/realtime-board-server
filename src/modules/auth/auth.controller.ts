import type { Request, Response } from "express"
import * as authService from "./auth.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password)
    res.status(201).json(result);
})
export const login = asyncHandler(async (req: Request, res: Response) => {
    console.log("req.body ->", req.body);
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password)
    res.status(201).json(result);
})