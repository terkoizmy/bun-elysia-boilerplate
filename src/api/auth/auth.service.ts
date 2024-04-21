import { Elysia, t } from "elysia";
import { PrismaClient, UserProfile } from "@prisma/client";
import { comparePassword, hashPassword, md5hash } from "~utils/bcrypt";
import { validateEmail } from "./auth.validation"
import { isAuthenticated } from "~middlewares/auth";

const prisma = new PrismaClient();

export const test = ({body, setCookie, cookie}: any) => {
  console.log("asdasd")
  console.log(cookie)
  setCookie("Ddd", "ASDASD")
  return cookie
}

export const signup = async ({body, set} :any) => {
  const { email, name, password, username } = body;
  // const emailHash = md5hash(email);
  // const profileImage = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

  // Validation string email
  if (!validateEmail(email)) {
    set.status = 400;
    return {
      status: set.status,
      data: null,
      message: "Your email is no valid",
    }
  };

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!regex.test(password)) {
    set.status = 400;
    return {
      status: set.status,
      data: null,
      message: "Password must contain at least one uppercase letter, one lowercase letter, one symbol, and be at least 8 characters long.",
    }
  }
  
  const { hash, salt } = await hashPassword(password);
  
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      hash,
      salt,
      userProfile: { create: {} },
    }
  });

  return {
    success: true,
    message: "Account created",
    data: {
      user: newUser,
    },
  };
}

export const signin = async ({ body, set, jwt, setCookie } : any) =>  {
  const { email, password } = body;
  // verify email/username
  const user = await prisma.user.findFirst({
    where: {
      email
    },
    select: {
      id: true,
      hash: true,
      salt: true,
    },
  });

  if (!user) {
    set.status = 400;
    return {
      success: false,
      data: null,
      message: "Invalid credentials",
    };
  }

  // verify password
  const match = await comparePassword(password, user.salt, user.hash);
  if (!match) {
    set.status = 400;
    return {
      success: false,
      data: null,
      message: "Invalid credentials",
    };
  }

  // generate access and refresh token

  const accessToken = await jwt.sign({
    userId: user.id,
  });
  const refreshToken = await jwt.sign({
    userId: user.id,
  });
  setCookie("access_token", accessToken, {
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });
  setCookie("refresh_token", refreshToken, {
    maxAge: 86400 * 7, // 7 days
    path: "/",
  });

  return {
    success: true,
    data: null,
    message: "Account login successfully",
  };
}

export const getMe = async (body : any) => {
  try {
    console.log(body)
    return {
      success: true,
      message: "Fetch authenticated user details",
      data: {
        body
      },
    }; 
  } catch (error) {
    console.log("GET_ME",error)
  }
}


export const signout = async ({cookie} : any) => {
  delete cookie.access_token
  delete cookie.refresh_token
  return {
    success: true,
    message: "Account logout successfully",
  };
}