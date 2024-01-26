import mongoose, { isValidObjectId } from 'mongoose'
import { Tweet } from '../models/tweet.model.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body
  const owner = await User.findById(req.user._id)
  if (!content.trim()) {
    throw new ApiError(400, 'Content is required')
  }
  const tweet = await Tweet.create({ content, owner: owner._id })
  if (!tweet) {
    throw new ApiError(500, 'Something went wrong')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, 'Tweet created successfully'))
})

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, 'Invalid user ID')
  }
  const tweets = await Tweet.find({ owner: userId }).populate('owner')
  if (!tweets) {
    throw new ApiError(404, 'User not found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, 'Tweets retrieved successfully'))
})

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params
  const { content } = req.body
  if (!tweetId) {
    throw new ApiError(401, 'To update the tweet tweetId is required );')
  }
  if (!content.trim()) {
    throw new ApiError(
      401,
      'To update the tweet content massage is required!(:'
    )
  }
  const tweet = await Tweet.findByIdAndUpdate(tweetId, {
    content: content,
  })
  const updatedTweet = await tweet.save()
  if (!updatedTweet) {
    throw new ApiError(
      401,
      'there was something wrong while updating the tweet!'
    )
  }
  return res
    .status(201)
    .json(new ApiResponse(201, updatedTweet, 'Tweet updated successfully.'))
})

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params
  if (!tweetId.trim()) {
    throw new ApiError(401, 'To Tweet the tweet tweetId is required );')
  }
  const tweet = await Tweet.findByIdAndDelete(tweetId)
  return res
  .status(200)
  .json(new ApiResponse(200, tweet, "Tweet deleted successfully"))
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }
