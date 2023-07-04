import { FastifyInstance } from "fastify";
import { RegisterController } from "./controllers/register";
import { FindUserController } from "./controllers/find-user-by-email";

export async function appRoutes(app: FastifyInstance) {
	app.post("/users", RegisterController);
	app.get("/users/:email", FindUserController);
}
