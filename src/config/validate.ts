import { cleanEnv, num, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: num({ default: 30000 }),
  MONGODB: str(),
  JWT_SECRET: str(),
});
