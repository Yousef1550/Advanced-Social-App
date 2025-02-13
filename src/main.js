import express from 'express'
import { config } from 'dotenv'
import database_connection from './DB/connection.js'
import routerHandler from './utils/router-handler.utils.js'
config()




const bootstrap = async () => {
    const app = express()

    await database_connection()
    
    app.use(express.json())
    
    routerHandler(app, express)
    
    const port = process.env.PORT
    app.listen(port, () => {
        console.log(`Server is running on port ${port}!`);
    })
}


export default bootstrap