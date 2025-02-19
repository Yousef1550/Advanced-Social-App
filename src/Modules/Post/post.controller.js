import { Router } from "express";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { createPostService, listPostsService, listUserPostsService } from "./Services/post.service.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";



const postController = Router()


postController.use(authenticationMiddleware())

postController.post(
    '/createPost',
    MulterCloud(imageExtentions).array('images', 5),
    errorHandler(createPostService)
)

postController.get('/listUserPosts', errorHandler(listUserPostsService))

postController.get('/listPosts', errorHandler(listPostsService))

export default postController