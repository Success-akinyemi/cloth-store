import express from 'express'
import * as controllers from '../controllers/general.controller.js'

const router = express.Router()

//GET ROUTES
router.get('/getCategories', controllers.getCategories)

export default router