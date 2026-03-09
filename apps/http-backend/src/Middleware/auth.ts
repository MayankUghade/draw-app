import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface JwtPayload {
  id: string;
  userName: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    //Extract the token from the header
    const token = authHeader.split(" ")[1];

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    //Verify the token
    const decoded = jwt.verify(
      token as string,
      JWT_SECRET,
    ) as JwtPayload;

    req.body.user = {
      id: decoded.id,
      userName: decoded.userName,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
