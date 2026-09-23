import { Router } from "express";
import { register, login } from "./auth.controller.js"
import { validate } from "../../middlewares/validate.js"
import { registerSchema, loginSchema } from "./auth.validation.js"
import { authMiddleware, type AuthRequest } from "../../middlewares/authMiddleware.js";
import passport from "../../config/passport.js"
import jwt from "jsonwebtoken"


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, (req: AuthRequest, res) => {
    res.json({ userId: req.userId })
})

router.get("/google", passport.authenticate(
    "google",
    {
        scope: ["profile", "email"],
        session: false
    },
))

router.get("/google/callback", passport.authenticate(
    "google",
    {
        session: false,
        failureRedirect: "/login"
    }
),
    (req, res) => {
        const user = req.user as { id: string };
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" })

        res.redirect(`http://localhost:5173/auth/callback?token=${token}`)
    }
)

router.get("/github", passport.authenticate(
    "github",
    {
        scope: ["user:email"],
        session: false
    }
))

router.get("/github/callback", passport.authenticate(
    "github",
    {
        session: false,
        failureRedirect: "/login"
    }
), (req, res) => {
    const user = req.user as { id: string };
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" })

    res.redirect(`http://localhost:5173/auth/callback?token=${token}`)
})

export default router;