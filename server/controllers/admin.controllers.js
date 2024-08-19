import UserModel from "../model/User.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ProductCategoryModel from "../model/ProductCategory.js"

export async function adminLogin(req, res){
    console.log('REQ', req.body)
    const { email, password } = req.body

    try {
        if(!email || !password){
            return res.status(400).json({ success: false, data: 'Fill all neccessary fields'})
        }
        const userExist = await UserModel.findOne({ email: email })
        if(!userExist){
            return res.status(404).json({ success: false, data: 'User not found'})
        }

        const validPassword = bcryptjs.compareSync(password, userExist.adminPassword)
        if(!validPassword){
            return res.status(401).json({ success: false, data: 'Invalid credentials'})
        }

        const token = jwt.sign({ id: userExist._id, isAdmin: userExist.isAdmin }, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now() + 4 * 60 * 60 * 1000)
        const { password: hashedPassword, adminPassword, ...userData } = userExist._doc
        res.cookie('adminAccessToken', token, { httpOnly: true, expires: expiryDate }).status(200).json({ success: true, data: userData })
    } catch (error) {
        console.log('ERROR SINGIN USER', error)
        res.status(500).json({ success: false, data: 'Could not signin user'})
    }
}

export async function getAllUsers(req, res){
    const query = req.query.new
    try {
        const users = query ? await UserModel.find().sort({ _id: -1 }).limit(5) : await UserModel.find()
        if(!users){
            return res.status(404).json({ success: false, data: 'No users found'})
        }

        res.status(200).json({ success: true, data: users })
    } catch (error) {
        console.log('ERROR GETTING USER', error)
        res.status(500).json({ success: false, data: 'Could not get all users'})
    }
}

export async function getUser(req, res){
    const { id } = req.params
    try {
        const user = await UserModel.findById({ id: id })
        if(!user){
            return res.status(404).json({ success: false, data: 'No user found'})
        }

        const { password, ...data } = user._doc

        res.status(200).json({ success: true, data: data})        
    } catch (error) {
        console.log('ERROR GETTING USER', error)
        res.status(500).json({ success: false, data: 'Could not get all users'})
    } 
}

export async function makeAdmin(req, res){
    const { id } = req.params
    try {
        const user = await UserModel.findById({ _id: id })
        if(!user){
            return res.status(404).json({ success: false, data: 'No user found'})
        }

        user.isAdmin = true
        const hashedPassword = bcryptjs.hashSync(`${process.env.DEFAULT_ADMIN_PASSWORD}`, 10)
        user.adminPassword = hashedPassword
        await user.save()
        console.log('USER UPDATED>>', user.adminPassword)

        res.status(201).json({ success: true, data: 'USER UPDATED'})
    } catch (error) {
        console.log('ERROR MAKING USER ADMIN', error)
        res.status(500).json({ success: false, data: 'Could not get all users'})
    } 
}

export async function RemoveAdmin(req, res){
    const { id } = req.params
    try {
        const user = await UserModel.findById({ id: id })
        if(!user){
            return res.status(404).json({ success: false, data: 'No user found'})
        }

        user.isAdmin = false
        user.adminPassword = undefined;
        await user.save()

        res.status(201).json({ success: true, data: 'USER UPDATED'})
    } catch (error) {
        console.log('ERROR REMOVIG FROM USER ADMIN', error)
        res.status(500).json({ success: false, data: 'Could remove user from admin'})
    } 
}

export async function updateAdminPassword(req, res){
    const { password } = req.body;
    try {
        if(!password){
            return res.status(400).json({ success: false, data: 'Fill all neccessary fields'})
        }
        if(req.user.id !== req.params.id){
            return res.status(401).json({ success: false, data: 'You can only update you Account'})
        }
        const hashedPassword = bcryptjs.hashSync(password, 10)
        await UserModel.findByIdAndUpdate(req.params.id, { adminPassword: hashedPassword })

        res.status(200).json({ success: true, data: 'Password updated successfully' });
    } catch (error) {
        console.log('ERROR UPDATING ADMIN USER PASSWORD', error)
        res.status(500).json({ success: false, data: `Could not update user password`})
    }
}

export async function addCategory(req, res){
    const { name, img } = req.body
    try {
        console.log('BODY', req.body)
        if(!name || !img){
            return res.status(401).json({ success: false, data: `fill all Fields`})
        }
        const cat = name.toLowerCase().replace(/\s+/g, '');
        const newCategory = new ProductCategoryModel({ name, img, cat })
        await newCategory.save()
        console.log('NEW CATEGORY SAVED', newCategory)
        res.status(201).json({ success: true, data: 'New Category Added'})
    } catch (error) {
        console.log('ERROR ADDING CATEGORY', error)
        res.status(500).json({ success: false, data: `Could not add new category`})
    }
}

//get number of regisatered users per month
export async function RegistedUsers(req, res){
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1 ))

    try {
        const data = await UserModel.aggregate([
            { $match: { createdAt: { $gte: lastYear }} },
            {
                $project: {
                    month: { $month: '$createdAt' }
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: {$sum: 1}
                }
            }
        ])

        res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.log('ERROR GETTING USER', error)
        res.status(500).json({ success: false, data: 'Could not get all users'})
    } 
}
