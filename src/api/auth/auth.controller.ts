import { Elysia, t } from "elysia";
import { test, signup, signin, getMe, signout } from "./auth.service";
import { valSignin, valSignup } from "./auth.validation"
import { isAuthenticated } from "~middlewares/auth";

export const AuthController = new Elysia()
  .group("/auth", app => {
    return app
    .get("/test/:id", test)
    .post("/sign-up", signup, valSignup)
    .post("/sign-in", signin, valSignin)
    .post("/forgot-password", () => "LOGIN USER")
    .use(isAuthenticated)
    .post("/sign-out", signout)
    .post("/me", getMe)
    .post("/verify-email", () => "LOGIN USER123123")
    .post("/refresh-tokens", () => "LOGOUT USER")
    .post("reset-password", () => "LOGIN USER")
    .post("/send-verification-email", () => "LOGIN USER")
    
  })
  