import { t } from 'elysia'

export const valSignup = {
  body: t.Object({
    email: t.String(),
    username: t.String(),
    password: t.String(),
  }),
}

export const valSignin = {
  body: t.Object({
    email: t.String(),
    password: t.String(),
  }),
}

export const validateEmail = ( email: string ) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return pattern.test(email);
}