import { cloudinary } from "../../../Config/cloudinary.config.js"
import Comment from "../../../DB/models/comment.model.js"
import Post from "../../../DB/models/post.model.js"
import User from "../../../DB/models/users.model.js"
import { nanoid } from "nanoid"



export const addCommentService = async (req, res) => {
    const {_id} = req.authUser
    const {file} = req
    let {content, mentions, onModel} = req.body
    const {commentOnId} = req.params

    const commentObject = {
        ownerId: _id,
        content,
    }

    // in Multer form-data if I send 1 mention it will be sent as string not an array and "mentions.length" will be undefined so a response will be returned and this is not correct, so we do this condition to prevent any mistakes 
    if(mentions?.length){
        if(typeof(mentions) === 'string'){  
            mentions = [mentions]       
        }
        const users = await User.find({_id: {$in: mentions}})
        if(users.length !== mentions.length){
            return res.status(400).json({message: 'Invalid mentions'})
        }
        commentObject.mentions = mentions
    }

    if(onModel === 'Post'){    // commentOnId is a post  _id
        const post = await Post.findOne({_id: commentOnId, allowComments: true})
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }
    } else if(onModel === 'Comment'){     // commentOnId is a comment  _id
        const comment = await Comment.findById(commentOnId)
        if(!comment){
            return res.status(404).json({message: 'Comment not found'})
        }
    }
    commentObject.commentOnId = commentOnId
    commentObject.onModel = onModel

    if(file){
        const folderId = nanoid(4)
        const {secure_url, public_id} = await cloudinary().uploader.upload(
            file.path, 
            {
                folder: `${process.env.CLOUDINARY_FOLDER}/Comments/${folderId}`
            } 
        )
        commentObject.image = {
            URLS: {secure_url, public_id},
            folderId
        }
    }

    const comment = await Comment.create(commentObject)
    return res.status(200).json({message: 'Comment created successfully', comment})
}




export const listCommentsService = async (req, res) => {
    const comments = await Comment.find().populate(
        [
            {
                path: 'commentOnId',   // refPath
                populate: [             // nested populate
                    {
                        path: 'ownerId',
                        select: 'username -_id'
                    },
                ]
            }
        ]
    )
    return res.status(200).json({message: 'Success', comments})

}