import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js'

const router = Router()


// Routes for comments
//get all comments for a video
router.route('/:videoId/comments').get(getVideoComments)

//add a comment to a video
router.route('/:videoId/comments').post(verifyJwt, addComment)

//update a comment
router.route('/:videoId/comments/:commentId').patch(updateComment)

//delete a comment
router.route('/:videoId/comments/:commentId').delete(deleteComment)

export default router
