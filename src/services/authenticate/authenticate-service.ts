import { UserRepository } from "@/repositories/user-repository";
import { InvalidCredentialsError } from "../error/error-service";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateServiceRequest {
	email: string;
	password: string;
}

interface AuthenticateServiceResponse {
	user: User;
}

export class AuthenticateService {
	constructor(private userRepository: UserRepository) {}

	async authenticate({
		email,
		password
	}: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatches = await compare(password, user.password_hash);

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError();
		}

		return { user };
	}
}
