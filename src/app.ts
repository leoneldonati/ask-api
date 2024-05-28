import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { authRoutes } from './routes/auth'
import { clientHost, clientHostProduction } from './config'
import { postsRouter } from './routes/posts'
import { usersRouter } from './routes/users'



export const app = express()




app.disable('x-powered-by')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(morgan('dev'))

app.use(cors({
  origin: [clientHost!, clientHostProduction!],
  credentials: true,
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
}))

app.use(fileUpload({ useTempFiles: true, tempFileDir: './temp-files' }))


app.use(authRoutes)
app.use(postsRouter)
app.use(usersRouter)