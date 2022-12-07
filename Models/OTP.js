const mongoose = require('mongoose')

const OTPs = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    uid:mongoose.Types.ObjectId,
    opt:String
},{
    timestamps:true
})

module.exports = mongoose.model('otps',EmployeesSchema)