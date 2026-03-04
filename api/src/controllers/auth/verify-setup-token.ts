import { Request, Response } from "express";
import { User } from "../../models/User";

const verifySetupToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    const user = await User.findOne({ setupToken: token }).populate({
      path: "clinic",
      select: "name phone",
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        clinic: user.clinic,
      },
    });
  } catch (error) {
    console.log("Error verifying setup token: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

export default verifySetupToken;
