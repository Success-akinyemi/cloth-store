import express from 'express'
import * as controllers from '../controllers/cart.controller.js'
import { verifyToken, verifyTokenAndAdmin } from '../utils/verifyUser.js'

const router = express.Router()

//POST ROUTES
router.post('/create', verifyToken, controllers.createCart)
router.post('/update/:id', verifyToken, controllers.updateCart)
router.post('/delete/:id', verifyToken, controllers.deleteCart)

//GET ROUTES
router.get('/getCart/:userId', verifyToken, controllers.getUserCart)
router.get('/getAllCart', verifyTokenAndAdmin, controllers.getAllCart)

export default router