import express from 'express'
import fileUpload from 'express-fileupload'
import { authRoutes } from './routes/auth'

export const app = express()

app.disable('x-powered-by')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({ useTempFiles: true, tempFileDir: './temp-files' }))


app.use(authRoutes)