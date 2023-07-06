import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { EmailAlreadyExistsError } from "@/services/error/error-service";
import { makeUserService } from "@/factories/make-user-service";

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
		const userService = makeUserService();
		const {user} = await userService.create({
			name,
			email,
			password
		});
		return reply.status(201).send(user);
	} catch (error) {
		if (error instanceof EmailAlreadyExistsError) {
			return reply.status(409).send({ message: error.message });
		}
		throw error;
	}

	
}
