import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/env";
import { Role, User } from "../../models/User";

interface RefreshTokenPayload {
  user: {
    _id: string;
    role?: Role;
    clinicId?: string;
  };
  iat: number;
  exp: number;
}

const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes
const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days

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

    const user = await User.findById(decoded.user._id);

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "USER NOT FOUND" });

    const accessToken = jwt.sign(
      { user: { _id: user._id, clinicId: user.clinic, role: user.role } },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_LIFETIME },
    );

    const newRefreshToken = jwt.sign(
      { user: { _id: user._id, clinicId: user.clinic, role: user.role } },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_LIFETIME },
    );

    const userDetails = {
      _id: user?._id,
      email: user?.email,
      name: user?.name,
      clinic: user?.clinic,
      role: user.role,
    };

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: REFRESH_TOKEN_LIFETIME * 1000,
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
