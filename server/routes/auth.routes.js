import express from 'express'
import * as controllers from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', controllers.signup)
router.post('/signin', controllers.signin)
router.post('/google', controllers.google)
router.get('/signout', controllers.signout)


export default router