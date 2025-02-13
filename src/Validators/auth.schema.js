import Joi from "joi";
import { gendersEnum } from "../Constants/constants.js";



export const signUpSchema = {
    body: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
        phone: Joi.string(),
        DOB: Joi.date(),
        gender: Joi.string().valid(gendersEnum.MALE, gendersEnum.FEMALE, gendersEnum.NOT_SPECIFIED),
        isPublic: Joi.boolean().default(true)
    })
}




export const verifyEmailSchema = {
    body: Joi.object({
        email: Joi.string().required().email(),
        otp: Joi.number().required()
    })
}


export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).required()
    })
}