import mongoose, { isValidObjectId } from 'mongoose'
import { User } from '../models/user.model.js'
import { Subscription } from '../models/subscription.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params
  // TODO: toggle subscription
  if (!isValidObjectId(channelId)) throw new ApiError(400, 'Invalid channel id')
  const { _id: subscriberId } = req.user
  const subscriber = await User.findById(subscriberId)
  if (!subscriber) throw new ApiError(404, 'SubscriberId i not valid!')
  if (subscriberId === channelId)
    throw new ApiError(400, 'You cannot subscribe to your own channel!')
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  })

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id)
    return res
      .status(200)
      .json(new ApiResponse(200, subscriber, 'Unsubscribed successfully'))
  }

  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  })

  if (!subscription)
    throw new ApiError(
      500,
      'Something went wrong while subscribing the channel!'
    )
  return res
    .status(200)
    .json(new ApiResponse(200, subscription, 'Subscribed successfully'))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params
  const { page = 1, limit = 10 } = req.query
  if (!isValidObjectId(subscriberId)) throw new ApiError(400, 'Invalid channel id')
  const subscribers = await Subscription.find({ subscriber:subscriberId })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()
  const total = await Subscription.countDocuments({ subscriber: subscriberId})
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const pagination = { hasNextPage, hasPrevPage, totalPages, total }
  const response = new ApiResponse(
    201,
    [subscribers, pagination],
    'Subscribers retrieved successfully'
  )
  res.json(response)
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params
  const { page = 1, limit = 10 } = req.query
  if (!isValidObjectId(channelId)) throw new ApiError(400, 'Invalid channel id')
  const users = await Subscription.find({
    channel: channelId,
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()
  const total = await Subscription.countDocuments({ channel: channelId })
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const pagination = { hasNextPage, hasPrevPage, totalPages, total }
  const response = new ApiResponse(
    201,
    [users, pagination],
    'Subscribers retrieved successfully'
  )
  res.json(response)
})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }
