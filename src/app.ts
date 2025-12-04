import fastify from "fastify";
import { appRoutes } from "./http/routes.js";
import z, { ZodError } from "zod";
import { logger } from "./logger.js";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, request, reply) => {
  logger.error({ error, body: request.body }, "Unhandled error occurred");

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: z.treeifyError(error),
    });
  }
  // Send a generic error response
  reply.status(500).send({ message: "Internal Server Error" });
});
