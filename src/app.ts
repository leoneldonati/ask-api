import express from 'express'
import { authRoutes } from './routes/auth'

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(authRoutes)