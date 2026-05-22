import dotenv from "dotenv";
import path from "path";
import { env } from "process";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: env.PORT,
  connection_string: env.CONNECTION_STRING as string,
  jwt_token_secret: env.JWT_TOKEN_SECRET as string,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET as string,
};

export default config;
