import { Router } from "express";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { MulterCloud, MulterLocal } from "../../Middleware/multer.middleware.js";
import { deleteAccountService, uploadCloudCoverService, uploadCloudProfileService, uploadCoverPictures, uploadProfilePicture } from "./services/profile.service.js";
import { imageExtentions } from "../../Constants/constants.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";

const userController = Router()

userController.use( errorHandler(authenticationMiddleware()) )

userController.patch(
    '/uploadProfilePicture',
    MulterLocal('User/Profile', imageExtentions).single('profile'),                // single(fieldName)
    errorHandler( uploadProfilePicture )
)

userController.patch(
    '/uploadCoverPictures',
    MulterLocal('/User/Cover', imageExtentions).array('covers', 3),
    errorHandler( uploadCoverPictures )
)


userController.patch(
    '/uploadCloudProfile',
    MulterCloud(imageExtentions).single('profile'),
    errorHandler( uploadCloudProfileService )
)



userController.patch(
    '/uploadCloudCover',
    MulterCloud(imageExtentions).array('cover', 3),
    errorHandler( uploadCloudCoverService )
)



userController.delete('/deleteAccount', errorHandler( deleteAccountService ))


export default userController





    // Multer('User/Profile', imageExtentions).array('image', 2),
    // Multer('User/Profile', imageExtentions).fields(
    //     [
    //         {
    //             name: 'profile',
    //             maxCount: 1,
    //         },
    //         {
    //             name: 'cover',
    //             maxCount: 3
    //         }
    //     ]
    // ),