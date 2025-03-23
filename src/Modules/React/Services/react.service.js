import Comment from "../../../DB/models/comment.model.js"
import Post from "../../../DB/models/post.model.js"
import React from "../../../DB/models/react.model.js"




export const addReactService = async (req, res) => {
    const {_id} = req.authUser
    const {reactType, onModel} = req.body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    const {reactOnId} = req.params

    const reactObject = {
        ownerId: _id,
        reactType,
    }

    if(onModel === 'Post'){
        const post = await Post.findById(reactOnId)
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }
    } else if(onModel === 'Comment'){
        const comment = await Comment.findById(reactOnId)
        if(!comment){
            return res.status(404).json({message: 'Comment not found'})
        }
    }
    reactObject.onModel = onModel
    reactObject.reactOnId = reactOnId

    const react = await React.create(reactObject) 
    return res.status(200).json({message: 'React added successfully', react})
}


export const removeReactService = async (req, res) => {
    const {_id} = req.authUser
    const {reactId} = req.params

    const deletedReact = await React.findOneAndDelete({_id: reactId, ownerId: _id})
    if(!deletedReact){
        return res.status(404).json({message: 'React not found'})
    }
    return res.status(200).json({message: 'React deleted successfully'})
}