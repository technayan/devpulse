import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

//* CREATE USER
const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hash_password = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, role)
        VALUES($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *
        `,
    [name, email, hash_password, role],
  );

  delete result.rows[0].password;

  return result.rows[0];
};

//* LOGIN USER
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users
    WHERE email = $1
    `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  delete user.password;

  // JWT Token Generation
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_token_secret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken, user };
};

export const authService = {
  createUserIntoDB,
  loginUserIntoDB,
};
