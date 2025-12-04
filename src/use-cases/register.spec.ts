import { expect, it, describe } from "vitest";
import { RegisterUseCase } from "./register.js";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";

describe("Register Use Case", () => {
  it("should register a new user", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);
    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it("should hash user password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);
    const { user } = await registerUseCase.execute({
      name: "Jack Doe",
      email: "jack.doe@example.com",
      password: "securepassword",
    });

    const isPasswordCorrectlyHashed = await compare(
      "securepassword",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
    expect(user.password_hash).not.toBe("securepassword");
  });

  it("should not allow registration with an existing email", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    await registerUseCase.execute({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "anotherpassword",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Jane Smith",
        email: "jane.doe@example.com",
        password: "yetanotherpassword",
      }),
    ).rejects.toThrow("E-mail already exists");
  });
});
