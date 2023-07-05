import { Prisma, User } from "@prisma/client";
import { UserRepositoryInterface } from "./@repositories-interfaces";


export class InMemoryUserRepository implements UserRepositoryInterface {
	private users: User[] = [];

	async findById(id: string): Promise<User | null> {
		const user = this.users.find((user) => user.id === id);
		return user || null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.users.find((user) => user.email === email);
		return user || null;
	}

	async create({ name, email, password_hash }: Prisma.UserCreateInput): Promise<User> {
		const user = {
			id: `${this.users.length + 1}`,
			name,
			email,
            password_hash,
            created_at: new Date()
		};

		this.users.push(user);

		return user;
	}
}
