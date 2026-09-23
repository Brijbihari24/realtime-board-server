import { Socket } from "socket.io";
import jwt from "jsonwebtoken"

interface AuthSocket extends Socket {
    userId?: string
}

export const socketAuthMiddleware = (socket: AuthSocket, next: (err?: Error) => (void)) => {
    // step1. here we are taking token out
    const token = socket.handshake.auth?.token

    // checking token 
    if (!token) {
        return (
            next(new Error("Authentication Required"))
        )
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
        socket.userId = decoded.userId
        next()
    } catch (error) {
        return (
            next(new Error("Invalid or Expired Token"))
        )
    }

}

export type { AuthSocket };

