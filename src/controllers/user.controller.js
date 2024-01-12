import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating generate Access Token And Refresh Token'
    )
  }
}
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some(
      (field) => (field || '').trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required')
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (existedUser) {
    throw new ApiError(409, 'User with email or username already exists')
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required')
  }
  console.log(avatarLocalPath)
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required')
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.toLowerCase(),
  })

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  )

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user')
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered Successfully'))
})

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  console.log(req.body)
  console.log('username: ', username)
  console.log('email: ', email)
  if (username === '' || email === '') {
    throw new ApiError(400, 'Username or email is required')
  }
  console.log('username: ', username)
  console.log('email: ', email)
  const user = await User.findOne({ $or: [{ username }, { email }] })

  console.log('User: ', user)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid credentials')
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id)
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  )

  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    )
})
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: undefined },
    { new: true, runValidators: true }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'unauthorized request')
  }
  try {
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?.id)
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token')
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'refresh token are used or expired (;')
    }
    options = {
      httpOnly: true,
      secure: true,
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id)
    return res
      .status(200)
      .cookie('refreshToken', refreshToken, options)
      .cookie('accessToken', accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          'Access token refreshed successfully'
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.massage || 'Invalid refresh token')
  }
})
const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid credentials')
  }
  if (oldPassword === newPassword) {
    throw new ApiError(400, 'New password cannot be same as old password')
  }
  user.password = newPassword
  await user.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password updated successfully'))
})
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched successfully'))
})
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body
  if (
    [fullName, email, username].some((field) => (field || '').trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required')
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { fullName, email, username },
      new: true,
    }.select('-password -refreshToken')
  )
  if (!user) {
    throw new ApiError(500, 'Something went wrong while updating the user')
  }
  await user.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Account details updated successfully'))
})
const updateUserAvatar = asyncHandler(async (req, res) => {
  const oldUserAvatar = User.findById(req.user._id).select('avatar')
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required')
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if (!avatar) {
    throw new ApiError(
      400,
      'Avatar file is required || something went wrong while uploading the avatar file on cloudinary'
    )
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { avatar: avatar.url },
    new: true,
  }).select('-password -refreshToken')
  if (!user) {
    throw new ApiError(500, 'Something went wrong while updating the Avatar')
  }
  await user.save({ validateBeforeSave: false })
  //delet ther old avatar from cloudinary
  if (oldUserAvatar) {
    const publicId = oldUserAvatar.split('/').pop().split('.')[0]
    await deleteFromCloudinary(publicId)
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Avatar updated successfully'))
})
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const oldUserCoverImage = User.findById(req.user._id).select('coverImage')
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
    throw new ApiError(400, 'Cover Image file is required')
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage) {
    throw new ApiError(
      400,
      'Cover Image file is required || something went wrong while uploading the Cover Image file on cloudinary'
    )
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { coverImage: coverImage.url },
    new: true,
  }).select('-password -refreshToken')
  if (!user) {
    throw new ApiError(
      500,
      'Something went wrong while updating the Cover Image'
    )
  }
  await user.save({ validateBeforeSave: false })
  //delet ther old coverImage from cloudinary
  if (oldUserCoverImage) {
    const publicId = oldUserCoverImage.split('/').pop().split('.')[0]
    await deleteFromCloudinary(publicId)
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Cover Image updated successfully'))
})
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params
  if (!username) {
    throw new ApiError(400, 'Username is required')
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers',
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo',
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: '$subscribers' },
        channelSubscribedToCount: { $size: '$subscribedTo' },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, '$subscribers.subscriber'],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        username: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        isSubscribed: 1,
        email: 1,
      },
    },
  ])

  if (channel.length === 0) {
    throw new ApiError(404, 'Channel not found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], 'Channel fetched successfully'))
})
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: '$owner',
              },
            },
          },
        ],
      },
    },
  ])
  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, 'Watch History fetched successfully'))
})
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
}
