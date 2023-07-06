import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user/user-service";

export function makeUserService() {
	const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    
    return userService
}
