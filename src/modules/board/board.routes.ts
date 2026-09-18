import { Router } from "express";
import prisma from "../../config/db.js"

const router = Router()

router.post("/test-user", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: "test user",
                email: "testuser@test.com"
            }
        });
        res.status(200).json(user)
    } catch (error) {
        console.log("error -> ", error);
        res.status(500).json({ error: "Something went wrong" })
    }
})

export default router;
