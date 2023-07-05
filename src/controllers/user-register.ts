import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { UserService } from "@/services/user-service";
import { UserRepository } from "@/repositories/user-repository";
import { EmailAlreadyExistsError } from "@/services/error/error-service";

export async function RegisterUserController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const userRepository = new UserRepository();
		const userService = new UserService(userRepository);
		await userService.createUser({
			name,
			email,
			password
		});

	} catch (error) {
		if (error instanceof EmailAlreadyExistsError) {
			return reply.status(409).send({ message: error.message });
		}
		throw error;
	}

	return reply.status(201).send();
}
