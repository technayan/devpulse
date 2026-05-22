import type { Response } from "express";

type ResponseInfo<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
};

const sendResponse = <T>(res: Response, responseInfo: ResponseInfo<T>) => {
  const { success, message, data } = responseInfo;
  res.status(responseInfo.statusCode).json({
    success,
    message,
    data,
  });
};

export default sendResponse;
