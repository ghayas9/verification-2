const mongoose = require('mongoose')

const EmailVerification = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    CId:mongoose.Types.ObjectId,
    email:String,
    address:Object,
    personal:Object,
    idCard:Object,
},{
    timestamps:true
})

module.exports = mongoose.model('emailverification',EmailVerification)