import mongoose, { isValidObjectId } from 'mongoose'
import { Like } from '../models/like.model.js'
import { Video } from '../models/video.model.js'
import { Comment } from '../models/comment.model.js'
import { Tweet } from '../models/tweet.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'Invalid video id')
  }
  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(404, 'Video not found')
  }
  const like = await Like.findOne({ video: videoId, likedBy: req.user._id })
  if (like) {
    await like.remove()
    return new ApiResponse(200, null, 'Video unliked successfully').send(res)
  }
  const liked = await Like.create({ video: videoId, likedBy: req.user._id })
  if (!liked) {
    throw new ApiError(500, 'Something went wrong While liking the video!')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, liked, 'Video liked successfully'))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, 'Invalid comment id')
  }
  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw new ApiError(404, 'Comment not found')
  }
  const like = await Like.findOne({ comment: commentId, likedBy: req.user._id })
  if (like) {
    await like.remove()
    return new ApiResponse(200, null, 'Comment unliked successfully').send(res)
  }
  const liked = await Like.create({ comment: commentId, likedBy: req.user._id })
  if (!liked) {
    throw new ApiError(500, 'Something went wrong While liking the comment!')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, liked, 'Comment liked successfully'))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, 'Invalid tweet id')
  }
  const tweet = await Tweet.findById(tweetId)
  if (!tweet) {
    throw new ApiError(404, 'Tweet not found')
  }
  const like = await Like.findOne({ tweet: tweetId, likedBy: req.user._id })
  if (like) {
    await like.remove()
    return new ApiResponse(200, null, 'Tweet unliked successfully').send(res)
  }
  const liked = await Like.create({ tweet: tweetId, likedBy: req.user._id })
  if (!liked) {
    throw new ApiError(500, 'Something went wrong While liking the tweet!')
  }
  return res
    .status(201)
    .json(new ApiResponse(201, liked, 'Tweet liked successfully'))
})

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likes = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  }).populate({
    path: 'video',
    model: Video,
    select: 'title description thumbnail',
  })
  const videos = likes.filter(like => like.video !== null)
  if (!videos) {
    throw new ApiError(404, 'No liked videos found')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, 'Liked videos fetched successfully'))
})

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos }
