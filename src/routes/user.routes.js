import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import {
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
} from '../controllers/user.controller.js'
import {
  publishAVideo,
  getAllVideos,
  getVideoById,
} from '../controllers/video.controller.js'
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js'
import { get } from 'mongoose'
const router = Router()

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'cover',
      maxCount: 1,
    },
  ]),
  registerUser
)
// secure routes
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/update-password').post(verifyJwt, updatePassword)
router.route('/update-account-details').patch(verifyJwt, updateAccountDetails)
router
  .route('/update-avatar')
  .patch(verifyJwt, upload.single('avatar'), updateUserAvatar)
router
  .route('/update-cover')
  .patch(verifyJwt, upload.single('coverImage'), updateUserCoverImage)
router.route('/me').get(verifyJwt, getCurrentUser)
router.route('/c/:username').get(getUserChannelProfile)
router.route('/watch-history').get(verifyJwt, getWatchHistory)

// Routes for videos
//get all videos
router.route('/get-all-videos').get(getAllVideos)

//publish a video
router.route('/PublishVideo').post(
  verifyJwt,
  upload.fields([
    {
      name: 'file',
      maxCount: 1,
    },
    {
      name: 'thumbnail',
      maxCount: 1,
    },
  ]),
  publishAVideo
)

// get a video by id
router.route('/videos/Id/:videoId').get(getVideoById)

// Routes for comments
//get all comments for a video
router.route('/:videoId/comments').get(getVideoComments)

//add a comment to a video
router.route('/:videoId/comments').post(addComment)

//update a comment
router.route('/:videoId/comments/:commentId').patch(updateComment)

//delete a comment
router.route('/:videoId/comments/:commentId').delete(deleteComment)

export default router
