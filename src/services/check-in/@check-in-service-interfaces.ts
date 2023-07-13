import { CheckIn } from "@prisma/client";

export interface CreateCheckInServiceRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

export interface CreateCheckInServiceResponse {
	checkIn: CheckIn;
}

export interface CheckInServiceFindManyByUserIdRequest {
	userId: string;
	page: number;
}

export interface CheckInServiceFindManyByUserIdResponse {
	checkIns: CheckIn[];
}
