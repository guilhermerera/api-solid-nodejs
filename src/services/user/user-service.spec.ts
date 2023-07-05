import { expect, describe, it, beforeAll } from "vitest";
import { UserService } from "./user-service";
import { compare } from "bcryptjs";
import { InMemoryUserRepository } from "@/repositories/users-repository-in-memory";
import { EmailAlreadyExistsError } from "../error/error-service";

beforeAll(async () => {});

describe("User Service", () => {
	it("should be able to register", async () => {
		const usersRepository = new InMemoryUserRepository();
		const User = new UserService(usersRepository);

		const { user } = await User.create({
			name: "John Doe",
			email: "johndone@example.com",
			password: "testpass"
		});

		expect(user).toHaveProperty("id");
	});

	it("should hash user password upon registration", async () => {
		const usersRepository = new InMemoryUserRepository();
		const User = new UserService(usersRepository);

		const { user } = await User.create({
			name: "John Doe",
			email: "johndone@example.com",
			password: "testpass"
		});

		const isPasswordCorrectlyHashed = await compare(
			"testpass",
			user.password_hash
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("should not be able to register a new user with an email already in use", async () => {
		const usersRepository = new InMemoryUserRepository();
		const user = new UserService(usersRepository);

		const email = "johndoe@example.com";

		await user.create({
			name: "John Doe",
			email,
			password: "testpass"
		});

		expect(async () => {
			await user.create({
				name: "John Doe",
				email,
				password: "testpass"
			});
		}).rejects.toBeInstanceOf(EmailAlreadyExistsError);
	});
});
