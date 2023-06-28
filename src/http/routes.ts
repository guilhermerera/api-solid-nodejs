import { FastifyInstance } from "fastify";
import { RegisterController } from "./controllers/register";

export async function appRoutes(app: FastifyInstance) {
    app.post("/users", RegisterController)
}