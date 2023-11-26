import express  from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
)
app.use(express.json({limit: '50Kb'}))
app.use(express.urlencoded({limit: '16Kb', extends: true}))
app.use(cookieParser())

// Routes inport
import userRouter from './routes/user.routes.js'

// Routes declaration
app.use('/api/v1/users', userRouter)

export default app