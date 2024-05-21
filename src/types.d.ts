import type { Request } from "express"

declare type User = {}

declare interface ExtendedReq extends Request {
  user?: any
}