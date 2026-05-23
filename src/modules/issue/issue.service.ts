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

const getAllIssuesFromDB = async () => {
  // Getting All Issues
  const allIssues = await pool.query(
    `
      SELECT * FROM issues
    `,
  );

  // Getting All the user's ids who created issues
  const userIds = allIssues.rows.map((user) => user.id);

  const dynamicPlaceholder = userIds
    .map((id, index) => `$${index + 1}`)
    .join(",");

  // Getting users who created issues
  const usersData = await pool.query(
    `
    SELECT id, name, role FROM users
    WHERE id IN (${dynamicPlaceholder})
    `,
    userIds,
  );

  const users = usersData.rows;

  const usersMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  // Formatting All issues
  const formattedIssues = allIssues.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: {
      id: usersMap[issue.reporter_id].id,
      name: usersMap[issue.reporter_id].name,
      role: usersMap[issue.reporter_id].role,
    },
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return formattedIssues;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
