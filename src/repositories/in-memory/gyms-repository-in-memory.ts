import { Gym, Prisma } from "@prisma/client";
import { GymsRepositoryInterface } from "../@repositories-interfaces";
import { randomUUID } from "node:crypto";
import { GetResult, Decimal } from "@prisma/client/runtime";

export class InMemoryGymsRepository implements GymsRepositoryInterface {
	public gyms: Gym[] = [];

	async findById(id: string) {
		const gym = this.gyms.find((gym) => gym.id === id);
		return gym || null;
	}
}
