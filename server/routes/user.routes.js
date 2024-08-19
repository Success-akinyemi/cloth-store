import express from 'express'
import * as controllers from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.get('/', controllers.getUser)
router.post('/update/:id', verifyToken, controllers.updateUser)


router.delete('/delete/:id', verifyToken, controllers.deleteUser)


export default router