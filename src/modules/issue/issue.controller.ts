import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

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

const getAllIssues = async (req: Request, res: Response) => {
  const issues = await issueService.getAllIssuesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Issues retrieved successfully.",
    data: issues,
  });
};

export const issueController = {
  createIssue,
  getAllIssues,
};
