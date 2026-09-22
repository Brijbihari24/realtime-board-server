import { Router } from "express";
import { register, login } from "./auth.controller.js"
import { validate } from "../../middlewares/validate.js"
import { registerSchema, loginSchema } from "./auth.validation.js"
import { authMiddleware, type AuthRequest } from "../../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, (req: AuthRequest, res) => {
    res.json({ userId: req.userId })
})

export default router;