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
    if (!localFilePath) return null
    console.log('this is the local file path', localFilePath)
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    })
    console.log('file is uploaded on cloudinary')
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath) // delete the file from local storage
    return null
  }
}
function getPublicIdFromCloudinaryUrl(url) {
  // Remove the file extension
  let urlWithoutExtension = url.split('.').slice(0, -1).join('.')

  // Get the last part of the path
  let publicId = urlWithoutExtension.substring(
    urlWithoutExtension.lastIndexOf('/') + 1
  )

  return publicId
}
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null
    const response = await cloudinary.uploader.destroy(publicId)
    console.log('file is deleted from cloudinary')
    return response
  } catch (error) {
    return null
  }
}
const getVideoDuration = async (url) => {
  try {
    const publicId = getPublicIdFromCloudinaryUrl(url)
    if (!publicId) return null
    const response = await new Promise((resolve, reject) => {
      cloudinary.api.resource(publicId,{resource_type: 'video'}, (error, result) => {
        if (error) {
          console.error('Error getting video info:', error)
          reject(error)
        } else {
          console.log(result)
          resolve(result.duration)
        }
      })
    })
    return response
  } catch (error) {
    console.error('Error in getVideoDuration:', error)
    return null
  }
}

export {
  uploadOnCloudinary,
  getPublicIdFromCloudinaryUrl,
  deleteFromCloudinary,
  getVideoDuration,
}
