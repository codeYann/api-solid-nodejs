import "dotenv/config";
import { z } from "zod";
import { logger } from "../logger.js";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  HTTP_PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const zodErrorMessage = z.prettifyError(_env?.error);
  const message =
    "Failed to load environment variables".concat("\n\n") + zodErrorMessage;

  logger.error(`❌ ${message}`);
  throw new Error(message);
}

export const env = _env.data;
