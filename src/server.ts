import { app } from "./app.js";
import { env } from "./env/index.js";
import { logger } from "./logger.js";

app
  .listen({
    host: "0.0.0.0",
    port: env.HTTP_PORT,
  })
  .then(() => {
    logger.info(`Server running on localhost:${3333}`);
  });
