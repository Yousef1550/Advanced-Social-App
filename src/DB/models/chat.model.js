import mongoose from "mongoose";




const chatSchema = mongoose.Schema({
    // chat starter
    senderId: {     
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiverId: {       // chat replier
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // every single message data
    messages: [{
        body: {
            type: String,
            required: true 
        },
        sentAt: {
            type: Date,
            default: Date.now
        },
        // who send the message
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }
    }]
}, 
    {
        timestamps: true
    }
)

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)



export default Chat