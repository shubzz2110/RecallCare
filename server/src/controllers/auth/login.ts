import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/env";

const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes
const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days

export default async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid credentials" });
    }

    const accessToken = jwt.sign(
      { user: { _id: user._id, clinicId: user.clinic, role: user.role } },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_LIFETIME },
    );

    const refreshToken = jwt.sign(
      { user: { _id: user._id, clinicId: user.clinic, role: user.role } },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_LIFETIME },
    );

    const userDetails = {
      _id: user._id,
      email: user.email,
      name: user.name,
      clinicId: user.clinic,
      role: user.role,
    };
    res.cookie("refreshToken", refreshToken, {
      maxAge: REFRESH_TOKEN_LIFETIME * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userDetails,
      accessToken,
    });
  } catch (error) {
    console.log("Error login", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
}
