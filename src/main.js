import express from 'express'
import { config } from 'dotenv'
import database_connection from './DB/connection.js'
import routerHandler from './utils/router-handler.utils.js'
import { Server } from 'socket.io'
import cors from 'cors'
import { establsihIoConnection } from './utils/socket.utils.js'
config()




const bootstrap = async () => {
    const app = express()
    await database_connection()
    
    app.use(cors())             // middleware to allow requests on the server APIs from any domain
    app.use(express.json())
    
    routerHandler(app, express)
    
    const port = process.env.PORT
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}!`);
    })
    
    const io = new Server(server,           // establish connection to socket using my server information
        {
            cors: {
                origin: '*',
            }
        }
    )   
    establsihIoConnection(io)
}


export default bootstrap