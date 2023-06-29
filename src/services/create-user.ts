import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
}

export async function createUser({ name, email, password }: CreateUserDTO) {
	const userWithSameEmail = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (userWithSameEmail) {
		throw new Error("Email already in use");
	}

	const password_hash = await hash(password, 6);

	const prismaUsersRepository = new PrismaUsersRepository();
	await prismaUsersRepository.create({
		name,
		email,
		password_hash
	});
}
