import dotenv from 'dotenv'

dotenv.config()

export const clientHost = process.env.CLIENT_HOST
export const clientHostProduction = process.env.CLIENT_HOST_PRODUCTION
export const port = process.env.PORT ?? 8080

export const dbName = process.env.DB_NAME
export const dbPass = process.env.DB_PASS
export const dbUser = process.env.DB_USER

export const secretJwtWord = process.env.SECRET_JWT

export const cldName = process.env.CLD_NAME
export const cldKey = process.env.CLD_API_KEY
export const cldSecret = process.env.CLD_API_SECRET