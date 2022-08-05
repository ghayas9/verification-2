const mongoose = require('mongoose')

const EmailVerification = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    CId:{
        type:mongoose.Types.ObjectId
    },
    email:{
        type:String,
        unique:[true,'Email must be Unique']
    },
    verifyData:{
        type:Object
    }
},{
    timestamps:true
})

module.exports = mongoose.model('emailverification',EmailVerification)