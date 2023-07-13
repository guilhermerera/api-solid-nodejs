import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository-in-memory";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { CheckInService } from "./check-in-service";
import { InMemoryGymsRepository } from "@/repositories/in-memory/gyms-repository-in-memory";
import { MaxDistanceError, SameDayCheckInError } from "../error/error-service";

let checkinRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkinService: CheckInService;

describe("Check-in Service", () => {
	beforeEach(async () => {
		checkinRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		checkinService = new CheckInService(checkinRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "Gym 01",
			description: "Gym 01 description",
			phone: "(11) 99999-9999",
			latitude: -23.539352,
			longitude: -46.6902728
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
		).rejects.toBeInstanceOf(SameDayCheckInError);
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
		await gymsRepository.create({
			id: "gym-02",
			title: "Gym 02",
			description: "Gym 02 description",
			phone: "(11) 99999-9999",
			latitude: -23.552277,
			longitude: -46.650472
		});

		await expect(() =>
			checkinService.createCheckIn({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -23.539352,
				userLongitude: -46.6902728
			})
		).rejects.toBeInstanceOf(MaxDistanceError);
	});

	it("should be able to fetch check-in history", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

		await checkinService.createCheckIn({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -23.539352,
			userLongitude: -46.6902728
		});

		vi.setSystemTime(new Date(2022, 0, 21, 12, 0, 0));

		await checkinService.createCheckIn({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -23.539352,
			userLongitude: -46.6902728
		});

		const { checkIns } = await checkinService.findManyByUserId({
			userId: "user-01",
			page: 1
		});

		expect(checkIns).toHaveLength(2);
	});

	it("should be able to fetch paginated check-in history", async () => {
		// This Loop Creates 22 Check-ins
		for (let i = 1; i <= 22; i++) {
			vi.setSystemTime(new Date(2022, 0, i, 12, 0, 0));
			await checkinService.createCheckIn({
				gymId: `gym-01`,
				userId: "user-01",
				userLatitude: -23.539352,
				userLongitude: -46.6902728
			});
		}

		// Here we are fetching the second page of check-ins
		const { checkIns } = await checkinService.findManyByUserId({
			userId: "user-01",
			page: 2
		});

		// We expect to receive 2 check-ins, since we have 22
		// And the pagination is 20 per per age (Last updated: 07/12/2023)
		expect(checkIns).toHaveLength(2);
	});

	it("should be able to get check-ins count from metrics", async () => {
		const userId = "user-01";

		// This Loop Creates 22 Check-ins
		for (let i = 1; i <= 22; i++) {
			vi.setSystemTime(new Date(2022, 0, i, 12, 0, 0));
			await checkinService.createCheckIn({
				gymId: `gym-01`,
				userId: userId,
				userLatitude: -23.539352,
				userLongitude: -46.6902728
			});
		}

		// Here we are fetching the second page of check-ins
		const { checkInCount } = await checkinService.getCountByUserId({
			userId: userId
		});

		// We expect to receive 2 check-ins, since we have 22
		// And the pagination is 20 per per age (Last updated: 07/12/2023)
		expect(checkInCount).toEqual(22);
	});
});
