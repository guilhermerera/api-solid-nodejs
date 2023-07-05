import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { UserRepository } from "@/repositories/user-repository";
import { InvalidCredentialsError } from "@/services/error/error-service";
import { AuthenticateService } from "@/services/authenticate/authenticate-service";

export async function AuthenticateController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6)
	});

	const { email, password } = authenticateBodySchema.parse(request.body);

	try {
		const userRepository = new UserRepository();
		const authService = new AuthenticateService(userRepository);
		await authService.authenticate({
			email,
			password
		});
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: error.message });
		}
		throw error;
	}

	return reply.status(200).send();
}
