import { hash } from "bcryptjs";
import {
	EmailAlreadyExistsError,
	EmailNotFoundError,
	ResourceNotFound
} from "../error/error-service";
import { Gym } from "@prisma/client";
import { GymsRepositoryInterface } from "@/repositories/@repositories-interfaces";
import { randomUUID } from "crypto";

export interface CreateGymRequest {
	title: string;
	description: string | null;
	phone: string | null;
	latitude: number;
	longitude: number;
}

interface CreateGymResponse {
	gym: Gym;
}

export class GymService {
	constructor(private GymRepository: GymsRepositoryInterface) {}

	async create({
		title,
		description,
		phone,
		latitude,
		longitude
	}: CreateGymRequest): Promise<CreateGymResponse> {
		const gym = await this.GymRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude
		});

		return { gym };
	}

	async findById(id: string) {
		const Gym = await this.GymRepository.findById(id);

		if (!Gym) {
			throw new ResourceNotFound();
		}

		return { Gym };
	}
}
