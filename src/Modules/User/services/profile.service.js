import { cloudinary } from "../../../Config/cloudinary.config.js"
import User from "../../../DB/models/users.model.js"





export const uploadProfilePicture = async (req, res) => {
    // check if user is authenticated
    const {_id} = req.authUser
    const {file} = req                      // file data after uploading
    if(!file){
        return res.status(409).json({message: 'Profile picture required'})
    }
    const user = await User.findById(_id)
    if(!user){
        return res.status(404).json({message: 'User not authenticated, please login first'})
    }
    user.profilePicture = `${req.protocol}://${req.headers.host}/${file.path}`
    console.log(file);
    
    await user.save()
    return res.status(200).json({message: 'Profile picture uploaded successfully', user})
}


export const uploadCoverPictures = async (req, res) => {
    const {_id} = req.authUser
    const {files} = req         // array of objects
    if(!files?.length){
        return res.status(409).json({message: 'Cover picture required'})
    }
    console.log('Files Object ==>',files);
    
    const coversPaths = files.map(file => `${req.protocol}://${req.headers.host}/${file.path}`)

    const user = await User.findByIdAndUpdate(_id, {coverPictures: coversPaths}, {new: true})
    
    return res.status(200).json({message: 'Cover pictures uploaded successfully', user})
}



export const uploadCloudProfileService = async (req, res) => {
    const {_id} = req.authUser
    const {file} = req
    if(!file){
        return res.status(409).json({message: 'Profile picture required'})
    }
    console.log(file);      // file after parsing
    const {secure_url, public_id} = await cloudinary().uploader.upload(file.path, {
        folder: `${process.env.CLOUDINARY_FOLDER}/Users/Profile`,
        resource_type: 'image'
    })

    const user = await User.findByIdAndUpdate(_id, {profilePicture: {secure_url, public_id}}, {new: true})
    return res.status(200).json({message: 'User profile picture uploaded successfully', user})
}




export const uploadCloudCoverService = async (req, res) => {
    const {_id} = req.authUser
    const {files} = req

    const images = []
    for (const file of files) {
        const {secure_url, public_id} = await cloudinary().uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Users/Covers`,
            resource_type: 'image'
        })
        images.push({secure_url, public_id})
    }
    const user = await User.findByIdAndUpdate(_id, {coverPictures: images}, {new: true})
    return res.status(200).json({message: 'User cover pictures uploaded successfully', user})
}



export const deleteAccountService = async (req, res) => {
    const {_id} = req.authUser

    const deletedUser = await User.findByIdAndDelete(_id)

    // get public ids for profile and cover pictures
    const profilePublicId = deletedUser.profilePicture.public_id
    const coversPublicIds = deletedUser.coverPictures.map(image => image.public_id)

    // delete one resource (file) by public_id
    const data = await cloudinary().uploader.destroy(profilePublicId)   // return => ok, not found

    // delete multiple resources (files) by array of public_ids
    const bulk = await cloudinary().api.delete_resources(coversPublicIds)
    return res.status(200).json({message: 'User account deleted successfully'})
}


// to delete a folder on cloudinary, but first the folder should be empty and does not has any resources
// await cloudinary().api.delete_folder(`${process.env.CLOUDINARY_FOLDER}/Users/Covers`)