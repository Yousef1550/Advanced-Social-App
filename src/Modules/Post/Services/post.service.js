import { cloudinary } from "../../../Config/cloudinary.config.js"
import Post from "../../../DB/models/post.model.js"
import User from "../../../DB/models/users.model.js"
import { nanoid } from "nanoid"
import { pagination } from "../../../utils/pagination.utils.js"
import { populate } from "dotenv"

// JS doc
/**
 * creat post api
 * @api /post/create
 * @param {object} req
 * @param {object} res
 * @returns {Promise<Response>}
 * @description create post for user
 */

export const createPostService = async (req, res) => {
    const {_id} = req.authUser
    const {files} = req
    let {description, tags, allowComments} = req.body

    const postObject = {
        description,
        ownerId: _id,
        allowComments
    }
    // if conditions to execute a block of code & store this fields if they exist, prevent from storing null
    // tags = ['67b0d07870521305d35e079a', '67b0d07870521305d35e079a']

    if(tags?.length){
        if(typeof(tags) === 'string'){  
            tags = [tags]       
        }
        const users = await User.find({_id:{$in: tags}})        // check if all tags is included in the database _ids
        if(users.length !== tags.length){                       // check if all tags _ids are correct
            return res.status(400).json({message: 'Invalid tags'})
        }
        postObject.tags = tags
    }

    if(files?.length){
        const images = []
        const folderId = nanoid(4)
        for(const file of files){
            const {secure_url, public_id} = await cloudinary().uploader.upload(file.path, {
                folder: `${process.env.CLOUDINARY_FOLDER}/Posts/${folderId}`,
                resource_type: 'image' || 'video',
            })
            images.push({secure_url, public_id})
        }
        postObject.images = {
            URLS: images,
            folderId
        }
    }

    const post = await Post.create(postObject)
    return res.status(200).json({message: 'Post created successfully', post})

}


export const listUserPostsService = async (req, res) => {
    const {_id} = req.authUser

    const posts = await Post.find({ownerId: _id}).populate(
        [
            {
                path: 'ownerId',
                select: 'username'
            },
            {
                path: 'tags',
                select: 'username'
            }
        ]
    )
    return res.status(200).json({message: 'Success', posts})

}



export const listPostsService = async (req, res) => {
    const {page, limit} = req.query     
    

    // ----------------------------------- pagination ------------------------------------ //
    // const {limit, skip} = pagination(page, limiter)

    // const posts = await Post.find().populate(
    //     [
    //         {
    //             path: 'ownerId',
    //             select: 'username -_id'
    //         },
    //         {
    //             path: 'tags',
    //             select: 'username -_id'
    //         },
    //         {
    //             path: 'Comments'    // virtual populate
    //         },
    //         {
    //             path: 'Reacts'      // virtual populate  
    //         }
    //     ]
    // ).limit(limit).skip(skip)

    // const allPostsCount = await Post.countDocuments()


    // ----------------------------------- pagination (plugin) ------------------------------------ //
    const posts = await Post.paginate(
        {},     // filter query 
        {
            limit,
            page,
            populate: [
                    {
                        path: 'ownerId',
                        select: 'username -_id'
                    },
                    {
                        path: 'tags',
                        select: 'username -_id'
                    },
                    {
                        path: 'Comments'    // virtual populate
                    },
                    {
                        path: 'Reacts'      // virtual populate  
                    }
                ]
        }
    )
    return res.status(200).json({message: 'Success', posts})
}