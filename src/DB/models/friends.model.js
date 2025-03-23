import mongoose from "mongoose";


// every user and his friends

const friendsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }]
}, {
    timestamps: true
})


const Friends = mongoose.models.Friends || mongoose.model('Friends', friendsSchema)


export default Friends