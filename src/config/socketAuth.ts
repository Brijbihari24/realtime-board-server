import { Socket } from "socket.io";
import jwt from "jsonwebtoken"

interface AuthSocket extends Socket {
    userId: string
}

export const socketAuthMiddleware = (socket: AuthSocket, next: (err?: Error) => (void)) => {
    // step1. check if token is present
    const token = socket.handshake.auth?.token

    if (!token) {
        return (
            next(new Error("Authentication Required"))
        )
    }

}

