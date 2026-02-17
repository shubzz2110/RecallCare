import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import bcrypt from "bcryptjs";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/env";

const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 minutes
const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      omit: { password: false },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid credentials" });

    const isPasswordValid = await bcrypt.compare(
      password,
      String(user?.password),
    );

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid credentials" });

    const accessToken = jwt.sign(
      { user: { id: user.id, clinicId: user.clinicId, role: user.role } },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_LIFETIME },
    );

    const refreshToken = jwt.sign(
      { user: { id: user.id, clinicId: user.clinicId, role: user.role } },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_LIFETIME },
    );

    const userDetails = {
      id: user.id,
      email: user.email,
      name: user.name,
      clinicId: user.clinicId,
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
    console.log("Error creating clinic", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export default loginController;
