import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js";
import { RegisterUseCase } from "../register.js";

export function makeRegisterUseCase(): RegisterUseCase {
  const usersRepository = new PrismaUsersRepository();
  return new RegisterUseCase(usersRepository);
}
