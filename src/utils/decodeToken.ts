import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";

export const decodeToken = (token: string) => {
  return jwt.verify(token, config.jwt_token_secret) as JwtPayload;
};
