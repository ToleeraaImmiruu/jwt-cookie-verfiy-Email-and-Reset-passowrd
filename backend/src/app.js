import express from "express"
import cors from "cors"
import db from "./config/db.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/userRoutes.js"


dotenv.config();
db();
const app = express()
app.use(cookieParser());
//middleware 
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,              
}));

app.use("/api/",authRoute)
app.get("/", (req, res) => {
  res.send("API was running")
})

const port = process.env.PORT|| 5000

app.listen(port, () => {
console.log(`The server was running on the port ${port}`)
})

