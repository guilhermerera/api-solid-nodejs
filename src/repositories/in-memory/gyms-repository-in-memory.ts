import { Gym, Prisma } from "@prisma/client";
import { GymsRepositoryInterface } from "../@repositories-interfaces";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime";

export class InMemoryGymsRepository implements GymsRepositoryInterface {
	public gyms: Gym[] = [];

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data.id || randomUUID(),
			title: data.title,
			description: data.description || null,
			phone: data.phone || null,
			latitude: new Decimal(Number(data.latitude)),
			longitude: new Decimal(Number(data.longitude)),
			created_at: new Date()
		};

		this.gyms.push(gym);
		return gym;
	}

	async findById(id: string) {
		const gym = this.gyms.find((gym) => gym.id === id);
		return gym || null;
	}
}
