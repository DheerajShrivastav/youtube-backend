import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: '/.env'
})
// effecient aprouch to connect to db

connectDB()



// onather approuch to connect to db
//  import { express } from "express";
//  const app = express();
//  (async ()  => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on(error, (error) => {
//             console.log(error)
//             throw error
//         }
//         )
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is listening on port ${process.env.PORT}`)
//         })


//     } catch (error) {
//         console.log(error)
//         throw new Error('Error connecting to database')
//     }
// })()