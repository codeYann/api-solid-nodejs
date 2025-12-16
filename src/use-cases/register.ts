import type { UsersRepository } from "@/repositories/users-repository.js";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";
import { logger } from "@/logger.js";
import type { User } from "@/generated/prisma/client.js";

interface RegisterUseCaseInput {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseOutput {
  user: User;
}

export class RegisterUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseInput): Promise<RegisterUseCaseOutput> {
    logger.info({ email }, "Attempting to register new user");

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      logger.warn({ email }, "Registration failed: email already exists");
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 12);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    logger.info({ userId: user.id, email }, "User successfully registered");
    return { user };
  }
}
