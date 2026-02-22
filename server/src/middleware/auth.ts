import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { Role, User } from "../models/User";

interface TokenPayload {
  user: {
    _id: string;
    role?: Role;
    clinicId?: string;
  };
  iat: number;
  exp: number;
}

const parseToken = (req: Request): TokenPayload | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as unknown as TokenPayload;
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const decoded = parseToken(req);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    const user = await User.findById(decoded.user._id);
    if (!user || !user.isActive)
      return res.status(401).json({ message: "User inactive or deleted" });

    if (!user.clinic?.equals(decoded.user.clinicId))
      return res.status(403).json({
        success: false,
        message: "Not a valid clinic member",
        code: "NOT_A_MEMBER",
      });
    req.user = decoded.user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `This action requires one of these roles: ${allowedRoles.join(
          ", ",
        )}`,
        code: "INSUFFICIENT_PERMISSIONS",
      });
    }
    next();
  };
};
