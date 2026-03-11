import express, {Router} from "express"
import { Request, Response } from "express";
import { authMiddleware } from "../Middleware/auth";
import { RoomSchema } from "@repo/common/types";
import { generateSlug } from "@repo/common/utils";
import { prisma } from "@repo/database/client";

export const roomRouter:Router = express.Router();

roomRouter.post("/createRoom", authMiddleware , async(req:Request, res:Response)=>{
    try {
        const parsed = RoomSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: parsed.error.flatten()
                });
        }

        const { name } = parsed.data;
        const roomSlug = generateSlug();        

        const room = await prisma.room.create({
            data: {
                name,
                slug: roomSlug,
                admin: {
                    connect: {
                        id: (req as any).user.id
                    }
                }
            }
        })

        return res.status(201).json({
            message: "Room created successfully",
            room
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})