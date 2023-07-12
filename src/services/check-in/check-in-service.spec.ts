import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository-in-memory";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { CheckInService } from "./check-in-service";
import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository-in-memory";
import { Decimal } from "@prisma/client/runtime/library";

let checkinRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkinService: CheckInService;

describe("Check-in Service", () => {
	beforeEach(() => {
		checkinRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		checkinService = new CheckInService(checkinRepository, gymsRepository);

		gymsRepository.gyms.push({
			id: "gym-01",
			title: "Gym 01",
			description: "Gym 01 description",
			phone: "(11) 99999-9999",
			latitude: new Decimal(-23.539352),
			longitude: new Decimal(-46.6902728)
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await checkinService.createCheckIn({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -23.539352,
			userLongitude: -46.6902728
		});

		expect(checkIn).toHaveProperty("id");
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

		await checkinService.createCheckIn({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -23.539352,
			userLongitude: -46.6902728
		});

		await expect(() =>
			checkinService.createCheckIn({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: -23.539352,
				userLongitude: -46.6902728
			})
		).rejects.toBeInstanceOf(Error);
	});

	it("should be able to check in twice in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

		await checkinService.createCheckIn({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -23.539352,
			userLongitude: -46.6902728
		});

		vi.setSystemTime(new Date(2022, 0, 21, 12, 0, 0));

		const { checkIn } = await checkinService.createCheckIn({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -23.539352,
			userLongitude: -46.6902728
		});

		expect(checkIn).toHaveProperty("id");
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		gymsRepository.gyms.push({
			id: "gym-02",
			title: "Gym 02",
			description: "Gym 02 description",
			phone: "(11) 99999-9999",
			latitude: new Decimal(-23.552277),
			longitude: new Decimal(-46.650472)
		});

		await expect(() =>
			checkinService.createCheckIn({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -23.539352,
				userLongitude: -46.6902728
			})
		).rejects.toBeInstanceOf(Error);
	});
});
