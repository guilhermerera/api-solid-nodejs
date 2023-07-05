import { expect, describe, it } from "vitest";
import { UserService } from "./user-service";
import { compare } from "bcryptjs";
import { InMemoryUserRepository } from "@/repositories/users-repository-in-memory";
import {
	EmailAlreadyExistsError,
	UserEmailNotFound
} from "../error/error-service";

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

	it("should should be able to fetch user info with their email", async () => {
		const usersRepository = new InMemoryUserRepository();
		const _user = new UserService(usersRepository);

		const email = "johndoe@example.com";

		await _user.create({
			name: "John Doe",
			email,
			password: "testpass"
		});

		const { user } = await _user.findByEmail(email);

		expect(user.email).toBe(email);
	});

	it("should throw UserEmailNotFound error when fetching user info with a non existent email", async () => {
		const usersRepository = new InMemoryUserRepository();
		const _user = new UserService(usersRepository);

		await _user.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "testpass"
		});

		expect(() =>
			_user.findByEmail("email@dontexist.com")
		).rejects.toBeInstanceOf(UserEmailNotFound);
	});
});
