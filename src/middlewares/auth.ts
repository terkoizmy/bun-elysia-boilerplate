import { Elysia } from "elysia";
import { prisma } from "../libs/prisma";

export const isAuthenticated = (app: Elysia) =>
  // @ts-ignore
  app.derive(async ({ cookie, jwt, set }) => {
    if (!cookie!.access_token) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
      throw new Error("Please authenticate");
    }
    const { userId } = await jwt.verify(cookie!.access_token);
    if (!userId) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    return {
      user,
    };
  });

  