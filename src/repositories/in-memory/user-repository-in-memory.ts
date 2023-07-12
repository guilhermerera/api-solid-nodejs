import { Prisma, User } from "@prisma/client";
import { UserRepositoryInterface } from "../@repositories-interfaces";
import { randomUUID } from "node:crypto";

export class InMemoryUserRepository implements UserRepositoryInterface {
	private users: User[] = [];

	async findById(id: string) {
		const user = this.users.find((user) => user.id === id);
		return user || null;
	}

	async findByEmail(email: string) {
		const user = this.users.find((user) => user.email === email);
		return user || null;
	}

	async create({ name, email, password_hash }: Prisma.UserCreateInput) {
		const user = {
			id: randomUUID(),
			name,
			email,
			password_hash,
			created_at: new Date()
		};

		this.users.push(user);

		return user;
	}
}
