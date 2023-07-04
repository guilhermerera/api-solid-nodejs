import { UserRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import { EmailAlreadyExistsError, UserEmailNotFound } from "./error/error-service";

interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

export class UserService {
	constructor(private userRepository: UserRepository) { }
	
	async createUser({ name, email, password }: CreateUserDTO) {
		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new EmailAlreadyExistsError()
		}
		
		const password_hash = await hash(password, 6);

		await this.userRepository.create({
			name,
			email,
			password_hash
		});
	}

	async findUserByEmail(email:string) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new UserEmailNotFound()
		}
		
		return user;
	}

	
}
