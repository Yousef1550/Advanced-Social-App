import mongoose from "mongoose";

// child parent relation between comment & post

const commentSchema = new mongoose.Schema({
    content: String,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    image: {
        URLS: {
            secure_url: String,
            public_id: String
        },
        folderId: String
    },
    commentOnId: {                                  // if onModel = post, commentOnId => ref: post
        type: mongoose.Schema.Types.ObjectId,       // if onModel = comment, commentOnId => ref: comment
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment']       // should be the same models names
    }
}, {
    timestamp: true
})


const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)


export default Comment