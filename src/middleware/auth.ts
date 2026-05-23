import type { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import type { UserRole } from "../modules/auth/auth.interface";
import { decodeToken } from "../utils/decodeToken";
import sendResponse from "../utils/sendResponse";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized Access!",
      });
    }

    //* Decode token
    const decoded = decodeToken(token as string);

    //* Search user
    const userData = await pool.query(
      `
        SELECT * FROM users
        WHERE id = $1
        `,
      [decoded.id],
    );

    if (userData.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found!",
      });
    }

    const user = userData.rows[0];

    //* Check role
    if (roles.length && !roles.includes(user.role)) {
      sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Forbidden Access!",
      });
    }

    req.user = decoded;

    next();
  };
};

export default auth;
