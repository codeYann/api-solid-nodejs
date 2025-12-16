import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";

describe("Authenticate Use Case", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryUsersRepository);
  });

  it("should authenticate a user", async () => {
    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("secure password", 12),
    });

    const { user } = await sut.execute({
      email: "johndoe@example.com",
      password: "secure password",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await expect(() =>
      sut.execute({
        email: "wrongemail@example.com",
        password: "secure password",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("should not be able to authenticate with wrong password", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("secure password", 12),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "wrong password",
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});
