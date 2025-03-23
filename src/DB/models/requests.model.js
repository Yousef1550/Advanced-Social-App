import mongoose from "mongoose";



// every user and his pending requests

const requestsSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    pending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }]
}, {
    timestamps: true
})


const Requests = mongoose.models.Requests || mongoose.model('Requests', requestsSchema)


export default Requests