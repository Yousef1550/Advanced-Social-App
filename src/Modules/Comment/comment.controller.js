import { Router } from "express";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";
import { addCommentService, listCommentsService } from "./Services/comment.service.js";
import { MulterCloud } from "../../Middleware/multer.middleware.js";
import { imageExtentions } from "../../Constants/constants.js";

const commentController = Router()


commentController.use(authenticationMiddleware())

commentController.post(
    '/addComment/:commentOnId',
    MulterCloud(imageExtentions).single('image'),
    errorHandler(addCommentService)
)


commentController.get('/listComments', errorHandler(listCommentsService))

export default commentController