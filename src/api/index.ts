import { Elysia } from "elysia";

import { AuthController } from './auth/auth.controller'

export const apiRoutes = new Elysia();

apiRoutes.use(AuthController);