import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins-repository-in-memory";
import { describe, expect, it, beforeEach } from "vitest";
import { CheckInService } from "./check-in-service";

let checkinRepository: InMemoryCheckInsRepository;
let checkinService: CheckInService;

describe("Check-in Service", () => {
	beforeEach(() => {
		checkinRepository = new InMemoryCheckInsRepository();
		checkinService = new CheckInService(checkinRepository);
	});

	it("should be able to check in", async () => {
		const { checkIn } = await checkinService.createCheckIn({
			gymId: "1",
			userId: "1"
		});

		expect(checkIn).toHaveProperty("id");
		expect(checkIn.id).toEqual(expect.any(String));
	});
});
