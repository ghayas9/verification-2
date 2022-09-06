const mongoose = require('mongoose')

const ScanDouc = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    CId:mongoose.Types.ObjectId,
    ScanData:Object,
    amlResult:String,
    amlData:Object
},{timestamps:true})

module.exports = mongoose.model('scandouc',ScanDouc)