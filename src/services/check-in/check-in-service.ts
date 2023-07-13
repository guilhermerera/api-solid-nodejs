import {
	MaxDistanceError,
	ResourceNotFound,
	SameDayCheckInError
} from "../error/error-service";
import {
	CheckInsRepositoryInterface,
	GymsRepositoryInterface
} from "@/repositories/@repositories-interfaces";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import {
	CheckInServiceFindManyByUserIdRequest,
	CheckInServiceFindManyByUserIdResponse,
	CheckInServiceGetCountByUserIdRequest,
	CheckInServiceGetCountByUserIdResponse,
	CreateCheckInServiceRequest,
	CreateCheckInServiceResponse
} from "./@check-in-service-interfaces";

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
	}: CreateCheckInServiceRequest): Promise<CreateCheckInServiceResponse> {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFound();
		}

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
		);

		const MAX_DISTANCE_IN_KILOMETERS = 0.1;

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
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

	async findManyByUserId({
		userId,
		page
	}: CheckInServiceFindManyByUserIdRequest): Promise<CheckInServiceFindManyByUserIdResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page
		);
		return { checkIns };
	}

	async getCountByUserId({
		userId
	}: CheckInServiceGetCountByUserIdRequest): Promise<CheckInServiceGetCountByUserIdResponse> {
		const checkInCount = await this.checkInsRepository.getCountByUserId(userId);
		return { checkInCount };
	}
}
