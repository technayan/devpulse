import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue & { id: number }) => {
  const { title, description, type, status, id } = payload;

  const result = await pool.query(
    `
        INSERT INTO issues(title, description, type, status, reporter_id)
        VALUES($1, $2, $3, COALESCE ($4, 'open'), $5)
        RETURNING *
        `,
    [title, description, type, status, id],
  );

  return result;
};

export const issueService = {
  createIssueIntoDB,
};
