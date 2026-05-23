import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import type { IIssue, IUpdateIssue } from "./issue.interface";

//* CREATE ISSUE INTO DB
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

//* GET ALL ISSUES
const getAllIssuesFromDB = async (
  sort?: string,
  type?: string,
  status?: string,
) => {
  // Sorting query
  let orderBy = "ORDER BY created_at DESC";

  if (sort === "oldest") {
    orderBy = "ORDER BY created_at ASC";
  }

  // Filter
  const values: string[] = [];
  const conditions: string[] = [];

  // Type filtering
  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  // Status Filtering
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  // Filtering Query
  const filterQuery =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Getting All Issues
  const allIssues = await pool.query(
    `
      SELECT * FROM issues
      ${filterQuery}
      ${orderBy}
    `,
    values,
  );

  // Getting All the user's ids who created issues
  const userIds = allIssues.rows.map((issue) => issue.reporter_id);

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

//* GET SINGLE ISSUE FROM DB
const getSingleIssueFromDB = async (id: string) => {
  const issueData = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [id],
  );

  if (issueData.rows.length === 0) {
    throw new Error("Issue not found!");
  }

  const issue = issueData.rows[0];

  const userData = await pool.query(
    `
    SELECT id, name, role FROM users
    WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const user = userData.rows[0];

  const formattedIssue = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };

  return formattedIssue;
};

//* UPDATE ISSUE INTO DB
const updateIssueIntoDB = async (
  payload: IUpdateIssue,
  issueId: string,
  token: string,
) => {
  // Check token
  if (!token) {
    throw new Error("Unauthorized access!");
  }

  const decoded = jwt.verify(token, config.jwt_token_secret) as JwtPayload;

  // Check role
  if (!(decoded.role === "maintainer" || decoded.role === "contributor")) {
    throw new Error("Unauthorized access!");
  }

  // Get issue
  const getIssueData = await pool.query(
    `
      SELECT * FROM issues
      WHERE id = $1
    `,
    [issueId],
  );

  if (getIssueData.rows.length === 0) {
    throw new Error("Issue not found!");
  }

  const issue = getIssueData.rows[0];

  // Check issue creator and role
  if (decoded.role !== "maintainer") {
    if (issue.reporter_id !== decoded.id) {
      throw new Error("Forbidden access!");
    }

    if (issue.status !== "open") {
      throw new Error("Forbidden access!");
    }
  }

  const { title, description, type } = payload;

  // Update issue
  const updatedIssue = await pool.query(
    `
      UPDATE issues
      SET 
      title = COALESCE ($1, title),
      description = COALESCE ($2, description),
      type = COALESCE ($3, type),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `,
    [title, description, type, issueId],
  );

  return updatedIssue;
};

//* DELETE ISSUE FROM DB
const deleteIssueFromDB = async (id: string, token: string) => {
  if (!token) {
    throw new Error("Unauthorized access");
  }

  const decoded = jwt.verify(token, config.jwt_token_secret) as JwtPayload;

  if (decoded.role !== "maintainer") {
    throw new Error("Unauthorized access");
  }

  const result = await pool.query(
    `
      DELETE from issues
      WHERE id = $1
    `,
    [id],
  );

  return result;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
