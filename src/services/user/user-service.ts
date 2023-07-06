import { UserRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import {
	EmailAlreadyExistsError,
	EmailNotFoundError,
	ResourceNotFound
} from "../error/error-service";
import { User } from "@prisma/client";

export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

interface CreateUserResponse {
	user: User;
}

export class UserService {
	constructor(private userRepository: UserRepository) {}

	async create({
		name,
		email,
		password
	}: CreateUserDTO): Promise<CreateUserResponse> {
		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new EmailAlreadyExistsError();
		}

		const password_hash = await hash(password, 6);

		const user = await this.userRepository.create({
			name,
			email,
			password_hash
		});

		return { user };
	}

	async findByEmail(email: string) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new EmailNotFoundError();
		}

		return { user };
	}

	async findById(id: string) {
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new ResourceNotFound();
		}

		return { user };
	}
}
