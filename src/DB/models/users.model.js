import mongoose from "mongoose";
import { gendersEnum, ProvidersEnum, systemRoles } from "../../Constants/constants.js";



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: String,
    isDeactivated:{
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        secure_url: String,
        public_id: String
    },
    // nested schema
    coverPictures: [{
        secure_url: String,
        public_id: String
    }],
    confirmOtp: String,
    forgetOtp: String,
    role: {
        type: String,
        default: systemRoles.USER,
        enum: Object.values(systemRoles)
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    DOB: Date,
    gender: {
        type: String,
        enum: Object.values(gendersEnum),
        default: gendersEnum.NOT_SPECIFIED
    },
    provider: {
        type: String,
        default: ProvidersEnum.SYSTEM,
        enum: Object.values(ProvidersEnum)
    }
}, {timestamp: true})


const User = mongoose.models.user || mongoose.model('user', userSchema)


export default User