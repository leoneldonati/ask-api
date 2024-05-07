import jwt from 'jsonwebtoken'
import { secretJwtWord } from '../config'

type PayloadJwt = {
  user: any;
  loggedAt: Date;
}
type SignJwtFn = (payload: PayloadJwt) => string

const signToken: SignJwtFn = (payload) => jwt.sign(payload, secretJwtWord!)

export {
  signToken
}