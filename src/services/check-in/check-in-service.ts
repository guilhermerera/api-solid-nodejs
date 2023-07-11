import { UserRepository } from "@/repositories/user-repository";
import { InvalidCredentialsError } from "../error/error-service";
import { compare } from "bcryptjs";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckInServiceRequest {
	userId: string;
	gymId: string;
}

interface CheckInServiceResponse {
	checkIn: CheckIn;
}

export class CheckInService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async createCheckIn({
		gymId,
		userId
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		});

		return { checkIn };
	}
}
