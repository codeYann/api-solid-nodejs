import type { UserCreateInput } from "@/generated/prisma/models.js";
import { prisma } from "@/lib/prisma.js";
import type { UsersRepository } from "../users-repository.js";
import type { User } from "@/generated/prisma/client.js";

export class PrismaUsersRepository implements UsersRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  create(data: UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
