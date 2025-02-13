import { compareSync, hashSync } from "bcrypt"
import User from "../../../DB/models/users.model.js"
import { encryption } from "../../../utils/encryption.utils.js"
import { emitter } from "../../../Services/send-email.service.js"
import { HTML_TEMPLATE } from "../../../Services/html-template.js"
import { signToken, verifyToken } from "../../../utils/jwt.utils.js"
import { v4 as uuidv4 } from 'uuid';
import BlackListTokens from "../../../DB/models/black-list-tokens.model.js"



export const signUpService = async (req, res) => {
    const {username, email, password, confirmPassword, phone, DOB, gender, ispublic} = req.body

    if(password !== confirmPassword){
        return res.status(409).json({message: 'Password and confirm password does not match'})
    }

    const isEmailExist = await User.findOne({email})
    if(isEmailExist){
        return res.status(409).json({message: 'Email already exists'})
    }

    const isUsernameExist = await User.findOne({username})
    if(isUsernameExist){
        return res.status(409).json({message: 'Username already taken'})
    }

    const encryptedPhone = await encryption({value: phone, secretKey: process.env.SECRET_KEY_PHONE})

    const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS)

    const confirmOtp = Math.floor(Math.random() * 10000)

    const hashedOtp = hashSync(confirmOtp.toString(), +process.env.SALT_ROUNDS)

    emitter.emit('sendEmail', ({
        to: email,
        subject: 'Verify your email',
        html: HTML_TEMPLATE(confirmOtp)
    }))
    
    const user = await User.create(
        {
            username,
            email,
            password: hashedPassword,
            phone: encryptedPhone,
            DOB,
            gender,
            ispublic,
            confirmOtp: hashedOtp
        }
    )
    if(!user){
        return res.status(409).json({message: 'Something went wrong, please try again later'})
    }

    return res.status(200).json({message: 'User created successfully', user})
}



export const verifyEmailService = async (req, res) => {
    const {email, otp} = req.body

    const user = await User.findOne({email, isVerified: false, confirmOtp: {$exists: true}})
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }
    
    const  isOtpValid = compareSync(otp.toString(), user.confirmOtp)

    if(!isOtpValid){
        return res.status(409).json({message: 'Invalid OTP'})
    }

    await User.findByIdAndUpdate(user._id, {isVerified: true, $unset: {confirmOtp: ''}})
    return res.status(200).json({message: 'User email verified successfully'})
}




export const signInService = async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})
    if(!user){
        return res.status(409).json({message: 'Invalid credintials'})
    }
    const isPasswordMatched = compareSync(password, user.password)
    if(!isPasswordMatched){
        return res.status(409).json({message: 'Invalid credintials'})
    }

    const accesstoken = signToken({
        data: {_id: user._id, email: user.email},
        secretKey: process.env.SECRET_KEY_ACCESS,
        options: {expiresIn: '1h', jwtid: uuidv4()}
    })

    const refreshtoken = signToken({
        data: {_id: user._id, email: user.email},
        secretKey: process.env.SECRET_KEY_REFRESH,
        options: {expiresIn: '2d', jwtid: uuidv4()}
    })
    return res.status(200).json({message: 'User logged in successfully', accesstoken, refreshtoken})
    
}



export const refreshTokenService = async (req, res) => {
    const {refreshtoken} = req.headers

    if(!refreshtoken){
        return res.status(404).json({message: 'Refresh token required'})
    }

    const decodedData = verifyToken({token: refreshtoken, secretKey: process.env.SECRET_KEY_REFRESH})

    const accesstoken = signToken({
        data: {_id: decodedData._id, email: decodedData.email},
        secretKey: process.env.SECRET_KEY_ACCESS,
        options: {expiresIn: '1h', jwtid: uuidv4()}
    })
    return res.status(200).json({message: 'Token refreshed successfully', accesstoken})
}


export const signOutService = async (req, res) => {
    const {accesstoken, refreshtoken} = req.headers
    if(!accesstoken || !refreshtoken){
        return res.status(404).json({message: 'Refresh & access tokens required'})
    }

    const decodedData_access = verifyToken({token: accesstoken, secretKey: process.env.SECRET_KEY_ACCESS})
    const decodedData_refresh = verifyToken({token: refreshtoken, secretKey: process.env.SECRET_KEY_REFRESH})

    await BlackListTokens.insertMany(
        [
            {
                tokenId: decodedData_access.jti,
                expiryDate: decodedData_access.exp
            },
            {
                tokenId: decodedData_refresh.jti,
                expiryDate: decodedData_refresh.exp
            }
        ]
    )
    return res.status(200).json({message: 'User logged out successfully'})
}