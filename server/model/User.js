import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'] 
    },
    email: {
        type: String,
        required: [true, 'Please add an Email'],
        unique: [true, 'Email already exist']
    },
    password: {
        type: String,
        required: [true, 'Please provide a passowrd']
    },
    profilePicture: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    lga: {
        type: String,
        default: ''
    },
    houseaddress: {
        type: String,
        default: ''
    },
    phonenumber: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    adminPassword: {
        type: String
    },
    grandAdmin: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
)

const UserModel = mongoose.model('theLimitsAsokeUser', UserSchema)

export default UserModel