import express, { Router } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserSchema } from "@repo/common/types";

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

      const { userName, password, name } = parsed.data;

      const existingUser = false;
      if (existingUser) {
        return res.status(409).json({ Error, message: "User already exists" });
      }
 
        const hashedPassword = await bcrypt.hash(password, 10)
        if (!JWT_SECRET) {
          throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign(
          {
            id: userName,
            userName,
            name,
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return res.status(201).json({ message: "User created successfully", token , userName, password:hashedPassword});        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }

});

userRouter.post("/signIn", async(req:Request, res:Response)=>{
  try {
    const { userName, password } = req.body;

    // Find user
    // const user = await User.findOne({ userName });
    // if (!user) {
    //   return res.status(404).json({ message: "Can't find the user" });
    // }

    // Compare password
    // const checkPassword = await bcrypt.compare(password, user.password);
    // if (!checkPassword) {
    //   return res.status(401).json({ message: "Incorrect password, try again" });
    // }

    // Create JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    // const token = jwt.sign(
    //   {
    //     id: user._id.toString(),
    //     userName: user.userName,
    //   },
    //   process.env.JWT_SECRET as string,
    //   { expiresIn: "7d" },
    // );

    return res.status(200).json({ message: "user signedIn successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Sign in failed", error: error.message });
  }
});

