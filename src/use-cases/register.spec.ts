import { expect, it, describe, beforeEach } from "vitest";
import { RegisterUseCase } from "./register.js";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";

describe("Register Use Case", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(inMemoryUsersRepository);
  });

  it("should register a new user", async () => {
    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secure password",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerUseCase.execute({
      name: "Jack Doe",
      email: "jack.doe@example.com",
      password: "secure password",
    });

    const isPasswordCorrectlyHashed = await compare(
      "secure password",
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
    expect(user.password_hash).not.toBe("secure password");
  });

  it("should not allow registration with an existing email", async () => {
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
