import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env',
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath)
        if(!localFilePath) return null
        console.log("this is the local file path", localFilePath)
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        console.log('file is uploaded on cloudinary')
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)// delete the file from local storage
        return null
    }
}
export { uploadOnCloudinary }