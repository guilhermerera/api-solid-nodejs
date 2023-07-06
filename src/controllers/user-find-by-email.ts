import { FastifyRequest, FastifyReply, RequestParamsDefault } from "fastify";
import { z } from "zod";
import { EmailNotFoundError } from "@/services/error/error-service";
import { makeUserService } from "@/factories/make-user-service";

type Params = RequestParamsDefault & {
	email: string;
};

export async function FindUserByEmailController(
	request: FastifyRequest<{ Params: Params }>,
	reply: FastifyReply
) {
	const emailSchema = z.string().email();

	try {
		const email = emailSchema.parse(request.params.email);
		const userService = makeUserService();
		const user = await userService.findByEmail(email);

		return reply.status(200).send(user);
	} catch (error) {
		if (error instanceof EmailNotFoundError) {
			return reply.status(404).send({ message: error.message });
		}
		throw error;
	}
}
