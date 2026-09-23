import { Router } from "express";
import prisma from "../../config/db.js"
import { createBoard, getSingleBoard, getAllBoards } from "./board.controller.js"
import { validate } from "../../middlewares/validate.js";
import { createBoardSchema } from "./board.validation.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

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

router.post("/create-board", authMiddleware, validate(createBoardSchema), createBoard)
router.get("/board/:id", authMiddleware, getSingleBoard)
router.get("/boards", authMiddleware, getAllBoards)

export default router;
