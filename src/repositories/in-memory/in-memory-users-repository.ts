import type { User } from "@/generated/prisma/client.js";
import type { UsersRepository } from "../users-repository.js";
import type { UserCreateInput } from "@/generated/prisma/models.js";

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    return Promise.resolve(user ?? null);
  }

  create(data: UserCreateInput): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);
    return Promise.resolve(user);
  }
}
