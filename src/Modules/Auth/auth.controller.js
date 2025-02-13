import { Router } from "express";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { refreshTokenService, signInService, signOutService, signUpService, verifyEmailService } from "./Services/auth.service.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { signInSchema, signUpSchema, verifyEmailSchema } from "../../Validators/auth.schema.js";


const authController = Router()


authController.post('/signUp', errorHandler( validationMiddleware(signUpSchema) ),  errorHandler( signUpService ))

authController.put('/verifyEmail', errorHandler( validationMiddleware(verifyEmailSchema) ), errorHandler( verifyEmailService ))

authController.post('/signIn', errorHandler( validationMiddleware(signInSchema) ), errorHandler( signInService ))

authController.post('/refreshtoken', errorHandler( refreshTokenService))

authController.post('/SignOut', errorHandler( signOutService ))

export default authController