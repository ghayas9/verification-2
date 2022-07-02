const mongoose = require('mongoose')

const EmployeesSchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    CId:{
        type:mongoose.Types.ObjectId
    },
    email:{
        type:String,
        unique:[true,'Email must be Unique']
    },
    IdCard:{
        type:String
    },
    Profile:{
        type:String
    },verifyData:{
        type:Object
    }
},{
    timestamps:true
})

module.exports = mongoose.model('employee',EmployeesSchema)