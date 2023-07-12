import { CheckIn, Gym, Prisma, User } from "@prisma/client";

export interface UserRepositoryInterface {
	create(data: Prisma.UserCreateInput): Promise<User>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: string): Promise<User | null>;
}

export interface CheckInsRepositoryInterface {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	findByUserIdOneDate(userId: string, date: Date): Promise<CheckIn | null>;
}

export interface GymsRepositoryInterface {
	create(data: Prisma.GymCreateInput): Promise<Gym>;
	findById(id: string): Promise<Gym | null>;
}
