import Friends from "../../../DB/models/friends.model.js"
import Requests from "../../../DB/models/requests.model.js"
import User from "../../../DB/models/users.model.js"





// send friend request
export const sendFriendRequestService = async (req, res) => {
    const {_id} = req.authUser
    const {requestToUserId} = req.params

    const user = await User.findById(requestToUserId)
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    // check if the loggedIn user already has requests document in the database or not
    let newRequest = null
    const request = await Requests.findOne({requestedBy: _id})
    
    // if already has requests doc, update it and add the new request to the pending requests
    if(request){
        const requestAlreadySent = request.pending.includes(requestToUserId)
        if(requestAlreadySent){
            return res.status(400).json({message: 'Freind request already sent'})
        }

        request.pending.push(requestToUserId)
        newRequest = request
        await newRequest.save()
    }else {
        // if doesn't has requests doc, create new one
        newRequest = await Requests.create(
            {
                requestedBy: _id,
                pending: [requestToUserId]
            }
        )
    }
    return res.status(200).json({message: 'Friend request sent successfully', newRequest})
}



// accept friend request
export const acceptFriendRequest = async (req, res) => {
    const {_id} = req.authUser      // joe
    const {requestSenderId} = req.params        // yousef

    const user = await User.findById(requestSenderId)
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    // check that the request sender sends a request or not
    const isRequestExists = await Requests.findOneAndUpdate({requestedBy: requestSenderId, pending:{$in:_id}},
        {
            $pull: {pending: _id}       // remove loggedIn user id from request send pending list
        }
    )
    if(!isRequestExists){
        return res.status(400).json({message: 'User does not send friend request'})
    }

    const friend = await Friends.findOne({userId: _id})     // joe friends doc
    let newFriend = null

    if(friend){
        const isRequestAccepted = friend.friends.includes(requestSenderId)
        if(isRequestAccepted){
            return res.status(400).json({message: 'Friend request already accepted'})
        }

        friend.friends.push(requestSenderId)
        newFriend = await friend.save()

    }else {
        newFriend = await Friends.create(
            {
                userId: _id,
                friends: [requestSenderId]
            }
        )
    }


    // add authUser to the requestSender friends after accepting the friend request (like facebook)
    const senderFriends = await Friends.findOne({userId: requestSenderId})     // yousef friends doc

    if(senderFriends){
        const isRequestAccepted = senderFriends.friends.includes(_id)
        if(isRequestAccepted){
            return res.status(400).json({message: 'Friend request already accepted'})
        }

        senderFriends.friends.push(_id)
        await senderFriends.save()

    }else {
        await Friends.create(
            {
                userId: requestSenderId,
                friends: [_id]
            }
        )
    }

    return res.status(200).json({message: 'Friend request accepted successfully', newFriend})

}



export const listFriendsService = async (req, res) => {
    const {_id, username} = req.authUser

    const friendsList = await Friends.findOne({userId: _id}).populate(
        [
            // {
            //     path: 'userId',
            //     select: 'username'
            // },
            {
                path: 'friends',
                select: 'username'
            }
        ]
    ).select('friends -_id')
    return res.status(200).json({message: 'Success', friendsList, user: {_id, username}})   // get loggedIn user data to be displayed on the website
}















/**
 * // accept friend request
export const acceptFriendRequest = async (req, res) => {
    const {_id} = req.authUser      // joe
    const {requestSenderId} = req.params        // yousef

    const user = await User.findById(requestSenderId)
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    // check that the request sender sends a request or not
    const isRequestExists = await Requests.findOne({requestedBy: requestSenderId})
    if(!isRequestExists && !isRequestExists?.pending?.includes(_id)){
        return res.status(400).json({message: 'User does not send friend request'})
    }

    const friend = await Friends.findOne({userId: _id})     // joe friends doc
    let newFriend = null
    if(friend){
        const isRequestAccepted = friend.friends.includes(requestSenderId)
        if(isRequestAccepted){
            return res.status(400).json({message: 'Friend request already accepted'})
        }

        friend.friends.push(requestSenderId)
        newFriend = friend
        await newFriend.save()

        // remove loggedIn user id from the request sender pending list
        let newPendingList = []
        const request = isRequestExists
        newPendingList = request.pending.filter((id) => id.toString() !== _id.toString())
        request.pending = newPendingList
        await request.save()

    }else {
        newFriend = await Friends.create(
            {
                userId: _id,
                friends: [requestSenderId]
            }
        )
        // remove loggedIn user id from the request sender pending list
        let newPendingList = []
        const request = isRequestExists
        newPendingList = request.pending.filter((id) => id.toString() !== _id.toString())
        request.pending = newPendingList
        await request.save()
    }
    return res.status(200).json({message: 'Friend request accepted successfully', newFriend})

}
 */