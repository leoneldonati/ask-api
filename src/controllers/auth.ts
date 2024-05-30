import type { Request, Response } from "express";
import { login, signup } from "../services/auth";
import { verifyClientPayload } from "../libs/zod";
import ms from "ms";
import { COOKIE_CONFIG, COOKIE_NAME } from "../config";

enum QUERY_TYPE {
  LOGIN = "login",
  LOGOUT = "logout",
  SIGN_UP = "signup",
}

export type UserPayload = {
  email: string;
  password: string;
  username?: string;
  name?: string;
  bio?: string;
  date?: Date;
  avatar: any;
};



async function handleAuth(req: Request, res: Response) {
  const queryType = req.query?.type;
  const userPayload = req.body as UserPayload;

  const isCorrectQuery =
    (queryType && queryType !== "" && queryType === QUERY_TYPE.LOGIN) ||
    queryType === QUERY_TYPE.SIGN_UP || queryType === QUERY_TYPE.LOGOUT;

  if (!isCorrectQuery)
    return res.status(400).json({
      message: "This query is wrong, please provide a correct type of query.",
      isCorrectQuery,
    });

  const { ok, error } = verifyClientPayload(
    {
      ...userPayload,
      date: userPayload.date ? new Date(userPayload.date!) : undefined,
    },
    { action: queryType }
  );

  if (!ok)
    return res.status(400).json({
      message: "You must provide a correct data format.",
      error,
    });

  const { email, password } = userPayload;
  try {
    // SI EL USUARIO QUIERE LOGUEARSE
    if (queryType.toString() === QUERY_TYPE.LOGIN) {
      const loginResponse = await login({ email, password });

      if (loginResponse.status > 299)
        return res.status(loginResponse.status).json({
          message: loginResponse.message,
          error: loginResponse?.error,
        });

      res
        .cookie(COOKIE_NAME, loginResponse.token?.toString(), COOKIE_CONFIG)
        .json( loginResponse.data );

      return;
    }

    // SI EL USUARIO QUIERE CREARSE UNA CUENTA
    if (queryType.toString() === QUERY_TYPE.SIGN_UP) {

      const signUpResponse = await signup({
        payload: { ...userPayload, date: new Date(userPayload.date!) },
        avatar: req.files,
      });

      if (signUpResponse.status > 299)
        return res.status(signUpResponse.status).json({
          message: signUpResponse.message,
          error: signUpResponse?.error,
        });

      res
        .cookie(COOKIE_NAME, signUpResponse.token?.toString(), COOKIE_CONFIG)
        .json({ message: signUpResponse.message });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error on server, please look.",
      error,
    });
  }
}

async function closeSession (req: Request, res: Response) {
  res.cookie(COOKIE_NAME, '', {...COOKIE_CONFIG, expires: new Date(0)})
}

async function checkSession (req: Request, res: Response) {
  res.json('Session alive!')
}
export { handleAuth, closeSession, checkSession };
