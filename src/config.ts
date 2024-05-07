import dotenv from 'dotenv'

dotenv.config()

export const clientHost = process.env.CLIENT_HOST
export const port = process.env.PORT ?? 8080

export const dbName = process.env.DB_NAME
export const dbPass = process.env.DB_PASS
export const dbUser = process.env.DB_USER

export const secretJwtWord = process.env.SECRET_JWT