import { InMemoryUserRepository } from "@/repositories/in-memory/user-repository-in-memory";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateService } from "./authenticate-service";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "../error/error-service";

let usersRepository: InMemoryUserRepository;
let _auth: AuthenticateService;

describe("Authenticate Service", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUserRepository();
		_auth = new AuthenticateService(usersRepository);
	});
	
	it("should be able to authenticate", async () => {
		const email = "johndone@example.com";
		const password = "testpass";

		await usersRepository.create({
			name: "John Doe",
			email,
			password_hash: await hash(password, 6)
		});

		const authUser = await _auth.authenticate({
			email,
			password
		});

		expect(authUser.user).toHaveProperty("id");
	});

	it("should not be able to authenticate with wrong email", async () => {
		const email = "johndone@example.com";
		const password = "testpass";

		await expect(() =>
			_auth.authenticate({
				email,
				password
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able to authenticate with wrong password", async () => {
		const email = "johndone@example.com";

		await usersRepository.create({
			name: "John Doe",
			email,
			password_hash: await hash("testpassword", 6)
		});

		await expect(() =>
			_auth.authenticate({
				email,
				password: "wrongpassword"
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});