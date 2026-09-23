import express from "express";
import cors from "cors";
import boardRoutes from "../src/modules/board/board.routes.js"
import authRoute from "../src/modules/auth/auth.route.js"
import { errorHandler } from "./middlewares/errorHandler.js";
import passport from "./config/passport.js"

// create app 
const app = express()

// middleware 
app.use(cors())
app.use(express.json());

app.use(passport.initialize())

app.use("/api/auth", authRoute)
app.use("/api/board", boardRoutes)

//create basic route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})


//last
app.use(errorHandler)

// export app 
export default app;

