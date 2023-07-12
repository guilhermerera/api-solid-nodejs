import { expect, describe, it, beforeEach } from "vitest";
import { GymService } from "./gym-service";
import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository-in-memory";


let GymsRepository: InMemoryGymsRepository;
let _Gym: GymService;

describe("Gym Service", () => {
	beforeEach(() => {
		GymsRepository = new InMemoryGymsRepository();
		_Gym = new GymService(GymsRepository);
	});

	it("should be able to create a new gym", async () => {
		const { gym } = await _Gym.create({
            title: "Test Gym",
            description: "Test Gym Description",
            phone: "123456789",
            latitude: -23.539352,
			longitude: -46.6902728,
		});

        expect(gym).toHaveProperty("id");
        expect(gym.id).toEqual(expect.any(String));
    });	
});
