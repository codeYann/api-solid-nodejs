import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(10),
});

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body);
  const authenticateUseCase = makeAuthenticateUseCase();

  try {
    await authenticateUseCase.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(200).send();
}
