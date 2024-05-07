import type { Request, Response } from "express"
import { login } from "../services/auth"
import { clientHost } from "../config";

enum QUERY_TYPE {
  LOGIN = 'login',
  SIGN_UP = 'signup'
}

type UserPayload = {
  email: string;
  password: string;
  username?: string;
  name?: string;
  bio?: string;
  date?: Date;
}

const HALF_HOUR = new Date(Date.now() * 18000)

const COOKIE_NAME = 'token-session'
const COOKIE_CONFIG =  {
  domain: clientHost,
  expires: HALF_HOUR,
  //httpOnly: true,
  //secure: true
}

async function handleAuth (req: Request, res: Response) {
  const queryType = req.query?.type
  const userPayload = req.body as UserPayload

  const isCorrectQuery = queryType && queryType !== '' && queryType === QUERY_TYPE.LOGIN || queryType === QUERY_TYPE.SIGN_UP

  if (!isCorrectQuery) return res.status(400).json({
    message: 'This query is wrong, please provide a correct type of query.',
    isCorrectQuery
  })

  const {
    email,
    password
  } = userPayload
  try {


    // SI EL USUARIO QUIERE LOGUEARSE
    if (queryType.toString() === QUERY_TYPE.LOGIN) {

      const loginResponse = await login({ email, password })

      if (loginResponse.status > 299) return res.status(loginResponse.status).json({ message: loginResponse.message, error: loginResponse?.error })

      res.cookie(COOKIE_NAME, loginResponse.data, COOKIE_CONFIG)

      return res.json({ message: loginResponse.message })

    }


    if (queryType.toString() === QUERY_TYPE.SIGN_UP) {}
    
  }
  catch (error) {
    return res.status(500).json({
      message: 'Error on server, please look.',
      error
    })
  }
}

export {
  handleAuth
}