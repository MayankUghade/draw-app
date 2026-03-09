import express, {Router} from "express"
import { Request, Response } from "express";
import { authMiddleware } from "../Middleware/auth";

export const roomRouter:Router = express.Router();

roomRouter.post("/createRoom", authMiddleware , async(req:Request, res:Response)=>{
    try {
        const {userName} = req.body
        
    } catch (error) {
        
    }
})