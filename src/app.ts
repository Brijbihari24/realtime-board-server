import express from "express";
import cors from "cors";

// create app 
const app = express()

// middleware 
app.use(cors())
app.use(express.json());

//create basic route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
})

// export app 
export default app;

