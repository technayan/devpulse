import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const newRequestBody = { ...req.body, id: user.id };
  const result = await issueService.createIssueIntoDB(newRequestBody);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: result.rows[0],
  });
};

export const issueController = {
  createIssue,
};
