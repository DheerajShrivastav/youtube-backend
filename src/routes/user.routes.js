import { Router } from 'express'
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
} from '../controllers/user.controller.js'
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
export default router
