import { CheckIn, Prisma } from "@prisma/client";

import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { CheckInsRepositoryInterface } from "../@repositories-interfaces";
import { CheckInServiceFindManyByUserIdRequest } from "@/services/check-in/@check-in-service-interfaces";
import { paginateArrayIn20PerPage } from "@/utils/paginate-items-in-an-array";

export class InMemoryCheckInsRepository implements CheckInsRepositoryInterface {
	private checkIns: CheckIn[] = [];

	async getCountByUserId(userId: string) {
		const checkInCount = this.checkIns.filter(
			(checkIn) => checkIn.user_id === userId
		).length;
		return checkInCount;
	}

	async findManyByUserId(userId: string, page: number) {
		const allUserCheckIns = this.checkIns.filter(
			(checkIn) => checkIn.user_id === userId
		);
		const paginatedUserCheckIns = paginateArrayIn20PerPage(
			allUserCheckIns,
			page
		);
		return paginatedUserCheckIns;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkInOnSameDate = this.checkIns.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.user_id === userId && isOnSameDate;
		});

		if (!checkInOnSameDate) {
			return null;
		}

		return checkInOnSameDate;
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		};

		this.checkIns.push(checkIn);

		return checkIn;
	}
}
