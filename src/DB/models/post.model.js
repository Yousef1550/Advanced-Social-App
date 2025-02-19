import mongoose from "mongoose";




const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    allowComments: {
        type: Boolean,
        default: true
    },
    images: {
        URLS: [{
            secure_url: String,
            public_id: String
        }],
        folderId: String
    }
}, {
    timestamp: true,
    toJSON: {           // virtials can be converted to json || object in this model
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

// before making virtual populate a relation should be exsisted between the 2 collections
// the output will be in 'Comments' field
postSchema.virtual('Comments', {
    ref: 'Comment',         // comment model
    localField: '_id',      // post Id
    foreignField: 'commentOnId'     // the post Id in the comment model 
})

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)


export default Post