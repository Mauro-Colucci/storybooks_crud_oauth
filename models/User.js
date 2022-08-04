const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId:{
        type: String,
        required: true
    },
    displayName:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    image:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}//you could use {timeStamps: true} here, instead of createdAt
)

module.exports = mongoose.model('User', UserSchema)