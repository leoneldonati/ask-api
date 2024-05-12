import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { authRoutes } from './routes/auth'
import { clientHost } from './config'

export const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: clientHost,
  credentials: true
}))

app.use(fileUpload({ useTempFiles: true, tempFileDir: './temp-files' }))


app.use(authRoutes)