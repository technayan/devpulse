import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

//* SIGNUP
const signup = async (req: Request, res: Response) => {
  const user = await authService.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

//* LOGIN
const login = async (req: Request, res: Response) => {
  const result = await authService.loginUserIntoDB(req.body);

  const { refreshToken, accessToken, user } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: { token: accessToken, user },
  });
};

export const authController = {
  signup,
  login,
};
