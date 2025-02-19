import mongoose from "mongoose";
import { Reacts } from "../../Constants/constants.js";





const reactSchema = mongoose.Schema({
    reactOnId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactType: {
        type: String,
        enum: Object.values(Reacts)
    }
}, {
    timestamp: true
})


const React = mongoose.models.React || mongoose.model('React', reactSchema)


export default React