import { globalErrorHandler } from "../Middleware/error-handler.middleware.js"
import authController from "../Modules/Auth/auth.controller.js"
import commentController from "../Modules/Comment/comment.controller.js"
import postController from "../Modules/Post/post.controller.js"
import reactController from "../Modules/React/react.controller.js"
import userController from "../Modules/User/user.controller.js"






const routerHandler = (app, express) => {
    app.use('/Assets', express.static('Assets'))   // used to find a static file if any api starts with /Assets
    app.use('/auth', authController)
    app.use('/user', userController)
    app.use('/post', postController)
    app.use('/comment', commentController)
    app.use('/react', reactController)


    app.use(globalErrorHandler)
}


export default routerHandler