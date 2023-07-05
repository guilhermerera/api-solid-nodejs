import { FastifyInstance } from "fastify";
import { RegisterUserController } from "./controllers/user-register";
import { FindUserController } from "./controllers/user-find-by-email";

export async function appRoutes(app: FastifyInstance) {
	app.post("/users", RegisterUserController);
	app.get("/users/:email", FindUserController);
}
