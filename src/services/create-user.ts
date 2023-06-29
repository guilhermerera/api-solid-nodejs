import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { EmailAlreadyExistsError } from "./errors/email-already-exists-error";

interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

export class CreateUser {
	constructor(private usersRepository: UsersRepository) {}
	async exec({ name, email, password }: CreateUserDTO) {
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new EmailAlreadyExistsError()
		}
		
		const password_hash = await hash(password, 6);

		await this.usersRepository.create({
			name,
			email,
			password_hash
		});
	}
}
