import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { userRouter } from "./Routes/user";
import { roomRouter } from "./Routes/room";
import { chatRouter } from "./Routes/chat";

const app = express()
app.use(express.json());

app.use("/user", userRouter);
app.use("/room", roomRouter)
app.use("/chat", chatRouter)

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})