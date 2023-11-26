import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFile) => {
    try {
        if(!localFile) return null
        cloudinary.uploader.upload(localFilePath, {
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