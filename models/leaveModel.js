const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    leaveType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    email: {
        type: String,
        ref: "User",
        required: true
    }
} , { timestamps: true })

module.exports = mongoose.model('Leave', leaveSchema)