import express from 'express'
import * as controllers from '../controllers/product.controller.js'
import { verifyTokenAndAdmin } from '../utils/verifyUser.js'

const router = express.Router()

//POST ROUTES
router.post('/createProduct', verifyTokenAndAdmin, controllers.createProduct)
router.post('/updateProduct/:id', verifyTokenAndAdmin, controllers.updateProduct)
router.post('/deleteProduct', verifyTokenAndAdmin, controllers.deleteProduct)
router.post('/setDiscount/:id', verifyTokenAndAdmin, controllers.setDiscount)


//GET ROUTES
router.get('/:id', controllers.getProduct)
router.get('/', controllers.getAllProduct)

export default router