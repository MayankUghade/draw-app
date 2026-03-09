import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

    //Verify the token
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
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
