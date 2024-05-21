import jwt from 'jsonwebtoken'
import { secretJwtWord } from '../config'
import ms from 'ms'


type PayloadJwt = {
  user: any;
  loggedAt: Date;
}
type SignJwtFn = (payload: PayloadJwt) => string

const signToken: SignJwtFn = (payload) => jwt.sign(payload, secretJwtWord!, { expiresIn: ms('30m') })


const verifyToken = (token: string) => jwt.verify(token, secretJwtWord!)


export {
  signToken,
  verifyToken
}