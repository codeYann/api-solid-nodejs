import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error.js";
import { RegisterUseCase } from "@/use-cases/register.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const registerBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(10),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body);

  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

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
