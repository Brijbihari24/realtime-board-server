import type { Request, Response } from "express"
import * as boardService from "./board.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import type { AuthRequest } from "../../middlewares/authMiddleware.js"

export const createBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title } = req.body
    const board = await boardService.createBoard(title, req.userId as string)
    res.status(201).json(board);
})

export const getSingleBoard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const board = await boardService.getBoardById(req.params.id as string, req.userId as string)
    res.status(200).json(board)
})


export const getAllBoards = asyncHandler(async (req: AuthRequest, res: Response) => {
    const boards = await boardService.getAllBoards(req.userId as string)
    res.status(200).json(boards)
})

