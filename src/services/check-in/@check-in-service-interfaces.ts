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

export interface CheckInServiceGetCountByUserIdRequest {
	userId: string;
	
}

export interface CheckInServiceGetCountByUserIdResponse {
	checkInCount: number
}
