import express from 'express'
import * as controllers from '../controllers/order.controller.js'
import { verifyToken, verifyTokenAndAdmin } from '../utils/verifyUser.js'

const router = express.Router()

//POST ROUTES
router.post('/createOrder', verifyToken, controllers.createOrder)
router.post('/updateOrder', verifyTokenAndAdmin, controllers.updateOrder)
router.post('/delete/:id', verifyTokenAndAdmin, controllers.deleteOrder)

//GET ROUTES
router.get('/getOrder/:userId', verifyToken, controllers.getUserOrder)
router.get('/getAllOrder', verifyTokenAndAdmin, controllers.getAllOrder)
router.get('/getSpecificOrder/:id', verifyTokenAndAdmin, controllers.getSpecificOrder)
router.get('/getMonthlyIncome', verifyTokenAndAdmin, controllers.getMonthlyIncome)


export default router