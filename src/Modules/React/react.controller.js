import { Router } from "express";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";

const reactController = Router()



reactController.use(authenticationMiddleware())





export default reactController