import prisma from "../../config/db.js";
import { AppError } from "../../utils/AppError.js"

// services 
export const createBoard = async (title: string, ownerId: string) => {
    return prisma.board.create({
        data: {
            title,
            ownerId
        }
    })
}

export const getBoardById = async (id: string, userId: string) => {
    const board = await prisma.board.findUnique({
        where: { id }
    })

    if (!board) {
        throw new AppError("Board not Found", 404)
    }
    if (board?.ownerId != userId) {
        throw new AppError("You do not have access to this Board", 403)
    }

    return (board)
}

export const getAllBoards = async (userId: string) => {
    const boards = await prisma.board.findMany({
        where: { ownerId: userId }
    })
    return (boards)
}
