import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import bcrypt from "bcryptjs";

const setPassword = async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body;
    const user = await prisma.user.findUnique({ where: { setupToken: token } });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Token used already or expired" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        setupToken: null,
        isActive: true,
      },
    });

    console.log(
      "[User Setup done]: Password has been set for user" + user.name,
    );

    return res
      .status(200)
      .json({ success: true, message: "Account setup successfull" });
  } catch (error) {
    console.log("Error while setting password: " + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};
export default setPassword;
