import "dotenv/config";

// configure .env 
// dotenv.config()

// console.log("process.env.CLIENT_URL ->", process.env.CLIENT_URL);
// console.log("process.env.DATABASE_URL ->", process.env.DATABASE_URL);
import { createServer } from "http"
import { Server } from "socket.io"
import app from "./app.js"
import { socketAuthMiddleware, type AuthSocket } from "./config/socketAuth.js"


// create server 
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [
            process.env.CLIENT_URL || "http://localhost:5173",
            "http://localhost:5500",  // test file ka origin
            "http://127.0.0.1:5500"
        ],
        methods: ["GET", "POST"]
    }
})

io.use(socketAuthMiddleware)

//configure socket io
io.on("connection", (socket: AuthSocket) => {
    console.log(`New socket connected with socketId: ${socket.id}`);

    socket.on("join-board", (boardId: string) => {
        socket.join(boardId)
        console.log(`socket with socketId ${socket.id} joined board with boardId ${boardId}`);

    })

    socket.on("leave-board", (boardId: string) => {
        socket.leave(boardId)
    })

    socket.on("disconnect", () => {
        console.log(`Socket/User with ${socket.userId} disconnected`);

    })

})


const PORT = process.env.PORT || 4000;

// listen our server
httpServer.listen(PORT, () => {
    console.log(`realtime board server is up and running on port ${PORT}`);
})