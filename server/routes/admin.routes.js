import express from 'express'
import * as controllers from '../controllers/admin.controllers.js'
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndGrandAdmin } from '../utils/verifyUser.js'

const router = express.Router()

//POST ROUTES
router.post('/adminLogin', verifyToken, controllers.adminLogin)

router.post('/makeAdmin/:id', verifyTokenAndGrandAdmin, controllers.makeAdmin)
router.post('/removeAdmin/:id', verifyTokenAndGrandAdmin, controllers.makeAdmin)

router.post('/updateAdminPassword/:id', verifyTokenAndAdmin, controllers.updateAdminPassword )
router.post('/newCategory', verifyTokenAndAdmin, controllers.addCategory )


//GET ROUTES
router.get('/getAllUsers', verifyTokenAndAdmin, controllers.getAllUsers)
router.get('/getUser/:id', verifyTokenAndAdmin, controllers.getUser)
router.get('/RegistedUsers', verifyTokenAndAdmin, controllers.RegistedUsers)


export default router