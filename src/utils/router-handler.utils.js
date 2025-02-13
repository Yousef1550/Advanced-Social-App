import { globalErrorHandler } from "../Middleware/error-handler.middleware.js"
import authController from "../Modules/Auth/auth.controller.js"
import userController from "../Modules/User/user.controller.js"






const routerHandler = (app, express) => {
    app.use('/Assets', express.static('Assets'))   // used to find a static file if any api starts with /Assets
    app.use('/auth', authController)
    app.use('/user', userController)



    app.use(globalErrorHandler)
}


export default routerHandler