import { Router } from "express";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { addReactService, removeReactService } from "./Services/react.service.js";
import { errorHandler } from "../../Middleware/error-handler.middleware.js";

const reactController = Router()



reactController.use(authenticationMiddleware())

reactController.post('/addReact/:reactOnId', errorHandler(addReactService))

reactController.delete('/removeReact/:reactId', errorHandler(removeReactService))

export default reactController