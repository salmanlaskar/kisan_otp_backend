const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    id:{
        type:String,
        required:true,
    },
    receivedMessageTimeStamp:{
        type:Number,
        default:Date.now()
    }
})

const message = mongoose.model('Message', messageSchema)

module.exports = message