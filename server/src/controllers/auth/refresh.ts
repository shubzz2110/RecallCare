import { Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/env";
import { prisma } from "../../config/prisma";

interface RefreshTokenPayload {
  user: {
    id: string;
    role?: UserRole;
    clinicId?: string;
  };
  iat: number;
  exp: number;
}

const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found in cookies",
      });
    }
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET!,
    ) as unknown as RefreshTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.user.id },
      omit: { role: false },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "USER NOT FOUND" });

    const accessToken = jwt.sign(
      { user: { id: user.id, clinicId: user.clinicId, role: user.role } },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      { user: { id: user.id, clinicId: user.clinicId, role: user.role } },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" },
    );

    const userDetails = {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      clinicId: user?.clinicId,
      role: user.role,
    };

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      user: userDetails,
    });
  } catch (error) {
    // Clear invalid refresh token cookie
    res.clearCookie("refreshToken", { path: "/" });

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    console.error("Error refreshing token:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while refreshing the token",
    });
  }
};
export default refreshTokenController;
