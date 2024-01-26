import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'

import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from '../controllers/video.controller.js'

const router = Router()
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

// update a video
router.route('/videos/Id/:videoId').patch(
  verifyJwt,
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  updateVideo
)

// delete a video
router.route('/videos/Id/:videoId').delete(verifyJwt, deleteVideo)

// toggle publish status
router
  .route('/videos/Id/:videoId/toggle-publish-status')
  .patch(verifyJwt, togglePublishStatus)

export default router
