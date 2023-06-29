import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { CreateUser } from "@/services/create-user";
import { Prisma } from "@prisma/client";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { EmailAlreadyExistsError } from "@/services/errors/email-already-exists-error";

export async function RegisterController(
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
		const userRepository = new PrismaUsersRepository();
		const createUser = new CreateUser(userRepository);
		await createUser.exec({
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
