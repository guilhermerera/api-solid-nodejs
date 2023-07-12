import { UserRepository } from "@/repositories/user-repository";
import {
	InvalidCredentialsError,
	MaxDistanceError,
	ResourceNotFound,
	SameDayCheckInError
} from "../error/error-service";
import { compare } from "bcryptjs";
import { CheckIn } from "@prisma/client";
import {
	CheckInsRepositoryInterface,
	GymsRepositoryInterface
} from "@/repositories/@repositories-interfaces";
import { get } from "http";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInServiceRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

interface CheckInServiceResponse {
	checkIn: CheckIn;
}

export class CheckInService {
	constructor(
		private checkInsRepository: CheckInsRepositoryInterface,
		private gymsRepository: GymsRepositoryInterface
	) {}

	async createCheckIn({
		gymId,
		userId,
		userLatitude,
		userLongitude
	}: CheckInServiceRequest): Promise<CheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFound();
		}

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOneDate(
			userId,
			new Date()
		);

		if (checkInOnSameDate) {
			throw new SameDayCheckInError();
		}

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		});

		return { checkIn };
	}
}
