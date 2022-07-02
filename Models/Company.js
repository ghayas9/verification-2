const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    logo:{type:String},
    name:{
        type:String,
        required:[true,'Name Is required']
    },
    email:{
        type:String,
        unique:[true,'Email must be unique'],
        required:[true,'Email Is required']
    },
    contact:{
        type:String,
    },
    password:{
      type:String,  
      required:[true,'Password Is required']
    },
    verify:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


module.exports = mongoose.model('company',companySchema)