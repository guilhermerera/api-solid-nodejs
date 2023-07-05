import { FastifyInstance } from "fastify";
import { RegisterUserController } from "./controllers/user-register";
import { FindUserController } from "./controllers/user-find-by-email";
import { AuthenticateController } from "./controllers/authenticate";

export async function appRoutes(app: FastifyInstance) {
	app.post("/users", RegisterUserController);
	app.get("/users/:email", FindUserController);
	app.post("/sessions", AuthenticateController)
}
