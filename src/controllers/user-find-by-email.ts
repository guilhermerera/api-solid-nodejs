import { FastifyRequest, FastifyReply, RequestParamsDefault } from "fastify";
import { z } from "zod";
import { UserService } from "@/services/user/user-service";
import { UserRepository } from "@/repositories/user-repository";
import { UserEmailNotFound } from "@/services/error/error-service";

type Params = RequestParamsDefault & {
	email: string;
};

export async function FindUserController(
	request: FastifyRequest<{ Params: Params }>,
	reply: FastifyReply
) {
	const emailSchema = z.string().email();

	try {
		const email = emailSchema.parse(request.params.email);

		const userRepository = new UserRepository();
		const userService = new UserService(userRepository);
		const user = await userService.findUserByEmail(email);

		return reply.status(200).send(user);
	} catch (error) {
		if (error instanceof UserEmailNotFound) {
			return reply.status(404).send({ message: error.message });
		}
		throw error;
	}
}
