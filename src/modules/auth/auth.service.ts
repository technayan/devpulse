import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

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

export const authService = {
  createUserIntoDB,
};
