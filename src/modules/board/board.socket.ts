import { Server } from "socket.io";
import * as Y from "yjs";
import type { AuthSocket } from "../../config/socketAuth.js";
import { getBoardById } from "./board.service.js";


const boardDocs = new Map<string, Y.Doc>();

const getOrCreateDoc = (boardId: string): Y.Doc => {
    if (!boardDocs.has(boardId)) {
        boardDocs.set(boardId, new Y.Doc())
    }
    return boardDocs.get(boardId) as Y.Doc
}

export const registerBoardSocketHandlers = (io: Server, socket: AuthSocket) => {
    socket.on("join-board", async (boardId: string) => {
        try {

            await getBoardById(boardId, socket.userId as string)

            socket.join(boardId)
            const doc = getOrCreateDoc(boardId)
            const current_state = Y.encodeStateAsUpdate(doc)
            socket.emit("sync-doc", current_state)
        } catch (error) {
            socket.emit("board-error", { message: "Can not join this Board" })
        }

    })
    socket.on("doc-update", (payload: { boardId: string, update: Uint8Array }) => {
        try {
            const { boardId, update } = payload;

            if (!socket.rooms.has(boardId)) return;

            const doc = getOrCreateDoc(boardId);
            Y.applyUpdate(doc, new Uint8Array(update))

            socket.to(boardId).emit("doc-update", update)
        } catch (error) {
            socket.emit("board-error", { message: "Invalid Update" })
        }


    })
    socket.on("leave-board", (boardId: string) => {
        socket.leave(boardId)
    })
}