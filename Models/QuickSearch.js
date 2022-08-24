const mongoose = require('mongoose')

const quickNameSearch = new mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    CId:mongoose.Types.ObjectId,
    name:String,
    dob:String,
    documentnumber:String,
    country:String,
    amlResult:String,
    API:Array
})

module.exports =mongoose.model('quickSearch',quickNameSearch)