import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

//* Create Issue
const createIssue = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const newRequestBody = { ...req.body, id: user.id };
  const userData = await issueService.createIssueIntoDB(newRequestBody);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: userData.rows[0],
  });
};

//* Get All Issue
const getAllIssues = async (req: Request, res: Response) => {
  const sort = req.query.sort as string;
  const type = req.query.type as string;
  const status = req.query.status as string;

  const issues = await issueService.getAllIssuesFromDB(sort, type, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issues retrieved successfully.",
    data: issues,
  });
};

//* Get Single Issue
const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  const issue = await issueService.getSingleIssueFromDB(id as string);

  if (!issue) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Issue not found!",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issue retrieved successfully.",
    data: issue,
  });
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};
