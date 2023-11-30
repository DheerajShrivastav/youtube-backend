import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env',
})
const connectDB = async () => {
  try {
      
      const conectionInstant = await mongoose.connect(
        `${process.env.MONGODB_URI}/${DB_NAME}`
      )
      console.log(`Connected to database ${conectionInstant.connection.host}}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB
