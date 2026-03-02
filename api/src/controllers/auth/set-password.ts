import { Request, Response } from "express";
import { User } from "../../models/User";

const setPassword = async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body;

    const user = await User.findOne({ setupToken: token });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Token used already or expired" });

    user.password = password;
    user.setupToken = undefined; // triggers sparse index to ignore it
    user.isActive = true;

    await user.save(); // triggers pre-save hook → hashes the password

    console.log("[User Setup done]: Password has been set for user", user.name);

    return res
      .status(200)
      .json({ success: true, message: "Account setup successful" });
  } catch (error) {
    console.log("Error while setting password: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

export default setPassword;
