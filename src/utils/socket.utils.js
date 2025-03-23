import { validateUserToken } from "../Middleware/authentication.middleware.js"
import { sendMessageService } from "../Modules/User/services/chat.service.js"



export const socketConnections = new Map


const registerSocketId = async (handshake, sId) => {
    // get user accesstoken
    const accesstoken = handshake.auth.accesstoken
    
    // get loggedIn user data after verifying the token
    const authUser = await validateUserToken(accesstoken)

    // attach socketId to user _id
    socketConnections.set(authUser._id.toString(), sId)

    console.log('Socket Connected', socketConnections);

    
}


const removeSocketId = async (socket) => {
    return socket.on('disconnect', async () => {
        const accesstoken = socket.handshake.auth.accesstoken

        const authUser = await validateUserToken(accesstoken)
    
        socketConnections.delete(authUser._id.toString())
        
        console.log('Socket Disconnected', socketConnections);

    })
}

export const establsihIoConnection = (io) => {
    io.on('connection', async (socket) => {       // Basic Emit, socket internally register this event for connection

        await registerSocketId(socket.handshake, socket.id)

        await sendMessageService(socket)

        await removeSocketId(socket)
    })
}










// socket.on('sendMessage', (data) => {
    // console.log(data);
    // socket.emit('replay', 'Hello from server')      // send replay to the sender socket only
    // io.emit('messageToAllClients', 'Hello from server to all clients')          // send replay to all clients

    // socket.broadcast.emit('brodcastReplay', 'Message to all clients except the sender')  // replay to all clients except the sender
    // socket.join('room2')
    // io.to('room2').emit('messageRoom', 'Hello to all room\'s clients')    
// })