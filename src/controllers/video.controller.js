import mongoose, { get, isValidObjectId } from 'mongoose'
import { Video } from '../models/video.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary, getVideoDuration } from '../utils/cloudinary.js'

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
  //TODO: get all videos based on query, sort, pagination
  const aggregate = Video.aggregate()
  if (query) {
    aggregate.match({
      title: { $regex: query, $options: 'i' },
    })
  }
  if (userId) {
    aggregate.match({
      owner: mongoose.Types.ObjectId(userId),
    })
  }
  if (sortBy) {
    aggregate.sort({
      [sortBy]: sortType === 'desc' ? -1 : 1,
    })
  }
  const skip = (page - 1) * limit
  const videos = await Video.aggregatePaginate(aggregate, {
    limit,
    skip,
    customLabels: {
      docs: 'videos',
    },
  })
  const total = await Video.countDocuments()
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages && total > limit
  const hasPrevPage = page > 1 && total > limit
  const pagination = { hasNextPage, hasPrevPage, totalPages, total }
  const response = new ApiResponse(
    videos,
    pagination,
    'Videos retrieved successfully'
  )
  res.json(response)
})

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body
  // TODO: get video, upload to cloudinary, create video
  if (!req.files?.file) {
    throw new ApiError(400, 'Please upload a video')
  }
  const videoLocalPath = req.files?.file[0]?.path
  if (!videoLocalPath) {
    throw new ApiError(400, 'videoLocalPath is not detected')
  }
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path
  if (!thumbnailLocalPath) {
    throw new ApiError(400, 'thumbnailLocalPath is not detected')
  }
  const file = await uploadOnCloudinary(videoLocalPath)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  const video = await Video.create({
    file: file.url,
    thumbnail: thumbnail.url,
    title,
    description,
    // duration: await getVideoDuration(file.url),
    views: 0,
    isPublished: true,
    owner: req.user,
  })
  const publishedVideo = await Video.findById(video._id).populate('owner', {
    avatar: 1,
    username: 1,
  })
  if (!publishedVideo) {
    throw new ApiError(400, 'something went wrong while publishing video')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, publishedVideo, 'Video published successfully'))
})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: get video by id
  if (!videoId.trim()) {
    throw new ApiError(400, 'videoId is required')
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'videoId is not valid')
  }
  const video = await Video.findById(videoId).populate('owner', {
    avatar: 1,
    username: 1,
  })
  if (!video) {
    throw new ApiError(404, 'Video not found')
  }
  return res.status(200).json(new ApiResponse(200, video, 'Video found'))
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: update video details like title, description, thumbnail
  if (!videoId.trim()) {
    throw new ApiError(400, 'videoId is required')
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'videoId is not valid')
  }
  const video = await Video.findById(videoId)
  const fileLocalPath = req.files?.file[0]?.path
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path
  const { title, description } = req.body

  if (fileLocalPath) {
    const file = await uploadOnCloudinary(fileLocalPath)
    video.file = file.url
  }
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    video.thumbnail = thumbnail.url
  }
  if (title) {
    video.title = title
  }
  if (description) {
    video.description = description
  }
  await video.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video updated successfully'))
})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: delete video
  if (!videoId.trim()) {
    throw new ApiError(400, 'videoId is required')
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'videoId is not valid')
  }
  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(404, 'Video not found')
  }
  await Video.deleteOne({ _id: videoId })
  return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video deleted successfully'))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  if (!videoId.trim()) {
    throw new ApiError(400, 'videoId is required')
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'videoId is not valid')
  }
  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(404, 'Video not found')
  }
  video.isPublished = !video.isPublished
  await video.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? 'published' : 'unpublished'} successfully`
      )
    )

})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
