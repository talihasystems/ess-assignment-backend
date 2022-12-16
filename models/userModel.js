const mongoose = require('mongoose')


const leave = {
    leave_Type_ID: {
        type: Number
    },
    leave_Name: {
        type: String
    },
    availableLeaves: {
        type: Number
    },
    requestedLeaves: {
        type: Number
    },
    availLeaves: {
        type: Number
    }
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
    }, 
    leaves: [
        new mongoose.Schema(leave)
    ],
    

} , { timestamps: true })

module.exports = mongoose.model('User', UserSchema)