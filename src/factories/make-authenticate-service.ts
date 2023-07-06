import { UserRepository } from "@/repositories/user-repository";
import { AuthenticateService } from "@/services/authenticate/authenticate-service";

export function makeAuthenticateService() {
	const userRepository = new UserRepository();
	const authService = new AuthenticateService(userRepository);

	return authService;
}
