import mongoose from 'mongoose'
import { Video } from '../models/video.model.js'
import { Subscription } from '../models/subscription.model.js'
import { Like } from '../models/like.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getAllVideos } from './video.controller.js'
const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.user._id
  const totalVideos = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(channelId) })
  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$views' },
      },
    },
  ])
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  })
  const totalLikes = await Like.countDocuments({ channel: channelId })
  const response = new ApiResponse(200, {
    totalVideos,
    totalViews,
    totalSubscribers,
    totalLikes,
  })
  res.status(200).json(response)

})

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  getAllVideos(req, res)

})

export { getChannelStats, getChannelVideos }
