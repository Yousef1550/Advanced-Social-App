import Chat from "../../../DB/models/chat.model.js"
import { validateUserToken } from "../../../Middleware/authentication.middleware.js"
import { socketConnections } from "../../../utils/socket.utils.js"








export const getChatHistory = async (req, res) => {
    const {_id} = req.authUser              // yousef
    const {receiverId} = req.params     // zain

    const chat = await Chat.findOne(
        {   // to handle both users if anyone of them viewed the chat
            $or:[
                {senderId: _id, receiverId},  // authUser strated the chat
                {senderId: receiverId, receiverId: _id}     // authUser receiver started the chat
            ]
        }
    ).populate(
        [
            {
                path: 'senderId',
                select: 'username profilePicture'
            },
            {
                path: 'receiverId',
                select: 'username profilePicture'
            },
            {
                path: 'messages.senderId',
                select: 'username profilePicture'
            }
        ]
    )
    return res.status(200).json({message: 'Chat history fetched successully', chat})
}



export const sendMessageService = async (socket) => {
    socket.on('sendMessage', async (message) => {          // message => body, receverId
        const authUser = await validateUserToken(socket.handshake.auth.accesstoken)
        const {body, receiverId} = message

        // check if there is chat doc in the db between these two users, either if anyone of them start the chat
        let chat = await Chat.findOneAndUpdate(
            {
                $or: [
                    {senderId: authUser._id, receiverId},
                    {senderId: receiverId, receiverId: authUser._id}
                ]
            },
            {   // if found add the new message body and it's sender
                $addToSet: {
                    messages: {
                        body,
                        senderId: authUser._id
                    }
                }
            }
        )
        if(!chat){  // if not create new chat doc
            chat = await Chat.create(
                {
                    senderId: authUser._id,
                    receiverId,
                    messages: [{
                        body,
                        senderId: authUser._id
                    }]
                }
            )
        }
        socket.emit('successMessage', {body, chat})    // return message and chat doc to the frontend

        // get receiver socket id to specifiy the message to him and to appear in real time with no need to refresh
        const messageReceiver_SId = socketConnections.get(receiverId.toString())    
        socket.to(messageReceiver_SId).emit('receiveMessage', {body}) 
    }) 
} 