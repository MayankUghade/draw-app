import express, { Router } from "express";
import { Request, Response } from "express";
import { authMiddleware } from "../Middleware/auth";
import {prisma} from "@repo/database/client";

export const chatRouter :Router = express.Router();

chatRouter.get("/:roomSlug", authMiddleware, async(req:Request, res:Response)=>{
    try {
        const {roomSlug} = req.params;
        const messages = await prisma.chat.findMany({
            where:{
               roomSlug:roomSlug as string
            },
            orderBy:{
                id:"desc"
            },
            take:50
            
        })
        res.json(
            messages
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
})