import mongoose from 'mongoose'
import { Comment } from '../models/comment.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params
  const { page = 1, limit = 10 } = req.query

  const comments = await Comment.aggregate([
    {
      $match: {
        videoId: mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'video',
        foreignField: '_id',
        as: 'comment',
      },
    },
    {
      $addField: {
        commentCount: { $size: '$comment' },
      },
    },
    {
      $project: {
        comment: 1,
        commentCount: 1,
        videoId: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ])
  const total = Comment.countDocuments({ video: mongoose.ObjectId('videoId') })
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  const pagination = { hasNextPage, hasPrevPage, totalPages, total }

  const response = new ApiResponse(
    comments,
    pagination,
    'Comments retrieved successfully'
  )
  res.json(response)
  // const skip = (page - 1) * limit
  // const comments = await Comment.find({ videoId })
  //     .skip(skip)
  //     .limit(limit)
  //     .populate('owner', 'name')
  //     .exec()
  // const total = await Comment.countDocuments({ videoId })
  // const totalPages = Math.ceil(total / limit)
  // const hasNextPage = page < totalPages
  // const hasPrevPage = page > 1
  // const pagination = { hasNextPage, hasPrevPage, totalPages, total }
  // const response = new ApiResponse(
  //     comments,
  //     pagination,
  //     'Comments retrieved successfully'
  // )
  //     res.json(response)
})

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content, video } = req.body
  if ([content, video].some((field) => field || '').trim() === '') {
    throw new ApiError(400, 'All field re required to add comment')
  }
  const owner = await User.findById(req.user._id)
  const comment = await Comment.create({
    content,
    owner: owner,
    video,
  })
  const addedComment = await Comment.findById(comment._id)
  if (!addedComment) {
    throw new ApiError(500, 'somthing went wrong while adding the comment!')
  }
  return res
    .status(201)
    .json(new ApiResponse(200, addedComment, 'comment added Succesfully'))
})

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { content } = req.body
  if (content.trim() === '') {
    throw new ApiError(400, 'Comment content is required')
  }
  const comment = await Comment.findByIdAndUpdate(req.params.commentId, {
    $set: {
      content,
    },
    new: true,
  })
  if (!comment) {
    throw new ApiError(404, 'somethng went wrong while updating the comment')
  }
  await comment.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment updated successfully'))
})

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const comment = await Comment.findByIdAndDelete(req.params.commentId)
  if (!comment) {
    throw new ApiError(404, 'somethng went wrong while deleting the comment')
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment deleted successfully'))
})

export { getVideoComments, addComment, updateComment, deleteComment }
