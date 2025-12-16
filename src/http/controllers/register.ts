import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error.js";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const registerBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(10),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body);

  const registerUseCase = makeRegisterUseCase();

  try {
    await registerUseCase.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
