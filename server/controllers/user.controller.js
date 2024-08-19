import bcryptjs from 'bcryptjs'
import UserModel from '../model/User.js'

export async function getUser(req, res){
    res.json('get user api')
} 

export async function updateUser(req, res){
    if(req.user.id !== req.params.id){
        return res.status(401).json({ success: false, data: 'You can only update you Account'})
    }
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }


        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    country: req.body.country,
                    state: req.body.state,
                    lga: req.body.lga,
                    houseaddress: req.body.houseaddress,
                    phonenumber: req.body.phonenumber,
                }
            },
            { new: true }
        );

        const { password, ...userData} = updatedUser._doc

        res.status(200).json({ success: true, data: userData })
    } catch (error) {
        console.log('ERROR UPDATING USER', error)
        res.status(500).json({ success: false, data: 'Failed to upload user'})
    }
} 

export async function deleteUser(req, res){
    console.log('DELETE API')
    if(req.user.id !== req.params.id){
        return res.status(401).json({ success: false, data: 'You can only delete you Account'})
    }
    try {
        await UserModel.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ success: true, data: 'User Deleted'})
    } catch (error) {
        console.log('ERROR UPDATING USER', error)
        res.status(500).json({ success: false, data: 'Failed to upload user'})
    }
}