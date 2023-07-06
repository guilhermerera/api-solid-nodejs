import { expect, describe, it, beforeEach } from "vitest";
import { UserService } from "./user-service";
import { compare } from "bcryptjs";
import { InMemoryUserRepository } from "@/repositories/user-repository-in-memory";
import {
	EmailAlreadyExistsError,
	EmailNotFoundError,
	ResourceNotFound
} from "../error/error-service";

let usersRepository: InMemoryUserRepository;
let _user: UserService;

describe("User Service", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository();
		_user = new UserService(usersRepository);
	});

	it("should be able to register", async () => {
		const { user } = await _user.create({
			name: "John Doe",
			email: "johndone@example.com",
			password: "testpass"
		});

		expect(user).toHaveProperty("id");
	});

	it("should hash user password upon registration", async () => {
		const { user } = await _user.create({
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
		const email = "johndoe@example.com";

		await _user.create({
			name: "John Doe",
			email,
			password: "testpass"
		});

		expect(async () => {
			await _user.create({
				name: "Another John",
				email,
				password: "another-test-pass"
			});
		}).rejects.toBeInstanceOf(EmailAlreadyExistsError);
	});

	it("should be able to fetch user info with their email", async () => {
		const email = "johndoe@example.com";

		await _user.create({
			name: "John Doe",
			email,
			password: "testpass"
		});

		const { user } = await _user.findByEmail(email);

		expect(user).toMatchObject({
			name: expect.any(String),
			email,
			password_hash: expect.any(String),
			id: expect.anything(),
			created_at: expect.any(Date)
		});
	});

	it("should not be able to fetch user info with a non existant email", async () => {
		expect(() =>
			_user.findByEmail("non-existent@email.com")
		).rejects.toBeInstanceOf(EmailNotFoundError);
	});

	it("should be able to fetch user info with their id", async () => {
		const createdUser = await _user.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "testpass"
		});

		const { user } = await _user.findById(createdUser.user.id);

		expect(user).toMatchObject({
			name: expect.any(String),
			email: expect.any(String),
			password_hash: expect.any(String),
			id: createdUser.user.id,
			created_at: expect.any(Date)
		});
	});

	it("should not be able to fetch user info with a non existant id", async () => {
		expect(() => _user.findById("non-existent-id")).rejects.toBeInstanceOf(
			ResourceNotFound
		);
	});
});
