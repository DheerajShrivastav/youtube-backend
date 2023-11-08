import { express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: process.env.CORS-ORIGIN,
    credentials: true
}))
app.use(express.json({limit: '50Kb'}))
app.use(express.urlencoded({limit: '16Kb', extends: true}))
app.use(cookieParser())

export default app