import express, { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema, SigninUserSchema } from "@repo/common/types";
import {prisma} from "@repo/database/client"

export const userRouter:Router = express.Router();

userRouter.post("/signUp", async(req:Request, res:Response)=>{
    try {
      const parsed = UserSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: parsed.error.flatten()
        });
      }

      const { email, password, name } = parsed.data;

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res.status(409).json({ Error, message: "User already exists, use a different email" });
      }
 
      const hashedPassword = await bcrypt.hash(password, 10)

      console.log(JWT_SECRET)
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
      }

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const token = jwt.sign(
        {
          id:user.id,
          email:user.email,
          name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({ message: "User created successfully", token , email, password:hashedPassword});        
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Internal server error" });
    }

});

userRouter.post("/signIn", async(req:Request, res:Response)=>{
  try {
const parsed = SigninUserSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: parsed.error.flatten()
        });
      }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Can't find the user" });
    }

    // Compare password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Incorrect password, try again" });
    }

    // Create JWT
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    console.log(JWT_SECRET)

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({ message: "user signedIn successfully" , token});
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Sign in failed", error: error.message });
  }
});

