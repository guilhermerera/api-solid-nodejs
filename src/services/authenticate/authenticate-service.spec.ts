import { InMemoryUserRepository } from "@/repositories/users-repository-in-memory";
import { describe, expect, it } from "vitest";
import { AuthenticateService } from "./authenticate-service";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "../error/error-service";

describe("Authenticate Service", () => {
	it("should be able to authenticate", async () => {
		const usersRepository = new InMemoryUserRepository();
		const _auth = new AuthenticateService(usersRepository);

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
		const usersRepository = new InMemoryUserRepository();
		const _auth = new AuthenticateService(usersRepository);

		const email = "johndone@example.com";
		const password = "testpass";

		expect(() =>
			_auth.authenticate({
				email,
				password
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able to authenticate with wrong password", async () => {
		const usersRepository = new InMemoryUserRepository();
		const _auth = new AuthenticateService(usersRepository);

		const email = "johndone@example.com";

		await usersRepository.create({
			name: "John Doe",
			email,
			password_hash: await hash("testpassword", 6)
		});

		expect(() =>
			_auth.authenticate({
				email,
				password: "wrongpassword"
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
