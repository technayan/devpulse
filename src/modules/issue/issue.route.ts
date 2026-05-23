import { Router } from "express";
import auth from "../../middleware/auth";
import { issueController } from "./issue.controller";

const router = Router();

router.post(
  "/",
  auth("contributor", "maintainer"),
  issueController.createIssue,
);

router.get("/", issueController.getAllIssues);

router.get("/:id", issueController.getSingleIssue);

router.patch("/:id", issueController.updateIssue);

export const issueRouter = router;
