import { JsonWebTokenError } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { User } from "../models/user.model"

export const verifyJwt =asyncHandler( async (req, res, next) => {
  try {
    const { token } = req?.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      throw new ApiError(401, 'Please login to continue')
    }
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
      if (!user) {
          throw new ApiError(404, 'User not found')
      }
    req.user = decoded
    next()  
  } catch (error) {
    new ApiError(401, error?.message || 'Please login to continue')
  }
})