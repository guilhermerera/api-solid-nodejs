import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { InvalidCredentialsError } from "@/services/error/error-service";
import { makeAuthenticateService } from "@/factories/make-authenticate-service";

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
		const authService = makeAuthenticateService();
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
