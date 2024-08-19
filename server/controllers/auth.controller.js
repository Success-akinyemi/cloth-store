import UserModel from "../model/User.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function signup(req, res){
    const { username, email, password } = req.body;
    try {
        if(!username || !email || !password){
            return res.status(400).json({ success: false, data: 'Fill all neccessary fields'})
        }
        const existingUser = await UserModel.findOne({ email })
        if(existingUser){
            return res.status(400).json({ success: false, data: 'User Email already exist' })
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)

        const newUser = new UserModel({ username, email, password: hashedPassword})
        await newUser.save()
        res.status(201).json({ success: true, data: 'User created successfully'})
    } catch (error) {
        console.log('ERROR CREATING USER', error)
        res.status(500).json({ success: false, data: `Could not create user: ${error?.message}`})
    }
}

export async function signin(req, res){
    const { email, password } = req.body
    console.log('WORKING')
    try {
        if(!email || !password){
            return res.status(400).json({ success: false, data: 'Fill all neccessary fields'})
        }
        const userExist = await UserModel.findOne({ email: email })
        if(!userExist){
            return res.status(404).json({ success: false, data: 'User not found'})
        }

        const validPassword = bcryptjs.compareSync(password, userExist.password)
        if(!validPassword){
            return res.status(401).json({ success: false, data: 'Invalid credentials'})
        }

        const token = jwt.sign({ id: userExist._id, isAdmin: userExist.isAdmin }, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now() + 4 * 60 * 60 * 1000)
        const { password: hashedPassword, adminPassword, ...userData } = userExist._doc
        res.cookie('accessToken', token, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true }).status(200).json({ success: true, data: userData })
    } catch (error) {
        console.log('ERROR SINGIN USER', error)
        res.status(500).json({ success: false, data: 'Could not signin user'})
    }
}

export async function google(req, res){
    const { name, email, photo } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if(user){
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...userData } = user._doc
            const expiryDate = new Date(Date.now() + 360000)
            res.cookie('accessToken', token, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: userData })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new UserModel({
                username: name,
                email: email,
                password: hashedPassword,
                profilePicture: photo
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET)
            const { password: hashedPassword2, adminPassword, ...userData } = newUser._doc
            const expiryDate = new Date(Date.now() + 360000)
            res.cookie('accessToken', token, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: userData })
        }
    } catch (error) {
        console.log('ERROR SINGIN USER WITH GOOGLE', error)
        res.status(500).json({ success: false, data: 'Could not signin user'})
    }
}

export async function signout(req, res){
    res.clearCookie('accessToken').status(200).json({success: true, data: 'Signout success'})
}