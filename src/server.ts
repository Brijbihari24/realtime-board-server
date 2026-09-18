import "dotenv/config";

// configure .env 
// dotenv.config()

// console.log("process.env.CLIENT_URL ->", process.env.CLIENT_URL);
// console.log("process.env.DATABASE_URL ->", process.env.DATABASE_URL);
import { createServer } from "http"
import { Server } from "socket.io"
import app from "./app.js"


// create server 
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

//configure socket io
io.on("connection", (socket) => {
    console.log(`user with socket id ${socket.id} is connected`);

    socket.on("disconnected", () => {
        console.log(`user with socket id ${socket.id} is disconnected`);
    })
})

const PORT = process.env.PORT || 4000;

// listen our server
httpServer.listen(PORT, () => {
    console.log(`realtime board server is up and running on port ${PORT}`);
})