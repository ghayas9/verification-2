//ERROR CODE 
//wrong password 403
//bad req 400
//server .. 500
//success 200
//not found 404
//401 - Unauthorized
const { CreatToken } = require('./auth')
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const Company = require('../Models/Company')
const mongoose = require('mongoose')
const Employee = require('../Models/Employees')
const axios = require('axios')



const IDAnalyzer = require("idanalyzer");
const { sendMail } = require('./email');
const bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(10);



const EmailVerification = require('../Models/EmailVerification')
const quickSearch = require('../Models/QuickSearch')
const ScanDouc = require('../Models/ScanDouc')
// const apikey = "aCTnGY3DlbZzIYGxJEkUfqqgUSGH96Ur"
const apikey = "fi8KfZUP9KgYXLYUa3wmERn8ZLiEx9v4"
const CoreAPI = new IDAnalyzer.CoreAPI(apikey, "US");
CoreAPI.enableAuthentication(true, 2);

module.exports = {
    LogIn: async (req, res) => {
        const value = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false, message: value.error.message
            })
        }
        try {
            const data = await Company.findOne({ email: req.body.email })
            if (data) {
                const isPsswordcorrect = bcrypt.compareSync(req.body.password, data.password)
                if (isPsswordcorrect) {
                    try {
                        const token = await CreatToken(data.toObject())
                        res.status(200).json({ success: true, token })
                    } catch (err) {
                        console.log(err);
                        res.status(500).json({ success: false, message: err })
                    }

                } else {
                    res.status(403).json({ success: false, message: 'wrong password' })
                }
            } else {
                res.status(403).json({ success: false, message: 'user not found' })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: 'some thing went wrong',
                err
            })
        }

    },
    Register: async (req, res) => {
        const value = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            contact: Joi.string().required(),
            password: Joi.string().required()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false,
                message: value.error.message
            })
        }
        try{
            const chk = await Company.findOne({email:req.body.email})
        if(!chk){
                const newCompany = new Company()
                var hash = bcrypt.hashSync(req.body.password, salt);

                newCompany._id = mongoose.Types.ObjectId()
                newCompany.name = req.body.name
                newCompany.email = req.body.email
                newCompany.contact = req.body.contact
                newCompany.password = hash

                try {
                    const data = await newCompany.save()
                  return  res.status(200).json({
                        success: true,
                        message: 'successfully register',
                        comp: data
                    })
                } catch (err) {
                    console.log(err)
                    return res.status(400).json({
                        success: false,
                        message: 'some thing went wrong',
                        err
                    })
                }
        }else{
            return res.status(400).json({
                success: false,
                message: 'Email Allready Register'
            })
        }
        
        }catch(err){
            return res.status(400).json({
                success: false,
                err,
                message:'server issue'
            })
        }
    },
    ChangePassword:async(req,res)=>{
        const value = Joi.object({
            currentPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
            conformPassword: Joi.any().equal(Joi.ref('newPassword'))
            .required()
            .label('Confirm password')
            .messages({ 'any.only': '{{#label}} does not match' }),
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false, message: value.error.message
            })
        }
        try{
        const up = await Company.updateOne({ _id: req.payload._id }, {
                $set: {
                    password: bcrypt.hashSync(req.body.newPassword, salt)
                }
            })
            return res.json({
                success: true,
                message:'password has been changed successfully'
            })
        }catch(err){
            return res.status(400).json({
                success: false,
                err,
                message:'try again later'
            })

        }
    },
    UpdateContact:async(req,res)=>{
        const value = Joi.object({
            contact: Joi.string().required()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false, message: value.error.message
            })
        }
        try{
            const up = await Company.updateOne({ _id: req.payload._id }, {
                $set: {
                    contact: req.body.contact
                }
            })
            const newdata = await Company.findOne({_id:req.payload._id},{password:0})
            return res.json({
                success: true,
                message: 'contact updated successfully',
                data:newdata
            })

        }catch(err){
            return res.json({
                success: false,
                message: 'try again later',
            })
        }
    },
    getDetails:async(req,res)=>{
        try{
            const data = await Company.findOne({
                _id:req.payload._id
            },{
                password:0
            })

            return res.json({
                sucess:true,
                data
            })
        }catch(err){
            return res.status(400).json({
                sucess:false,
                message:'try again later',
                err
            })
        }
    },
    ScanDouc: async (req, res) => {
        if (req.files) {
            if (req.files.length != 2) {
                return res.status(400).json({
                    success: false,
                    message: 'please provide 2 images'
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'please provide 2 images'
            })
        }
        try {
            CoreAPI.enableImageOutput(true, true, "url")
            const data = await CoreAPI.scan({ document_primary: req.files[0].buffer.toString('base64'), biometric_photo: req.files[1].buffer.toString('base64') })
            if (data.error) {
                return res.status(400).json({
                    success: false,
                    message: data.error.message
                })
            } else {

                try{

                    const amldata = await axios({
                        method: 'post',
                        url: 'https://api.idanalyzer.com/aml',
                        data: JSON.stringify({
                            documentnumber: data.result.documentNumber,
                        })
                    })
                    if (amldata.data.error) {
                        return res.status(400).json({
                            success: false,
                            message: amldata.data.error.message
                        })
                    } else {
                        var amlResult = ''
                        if (amldata.data.items.length > 0) {
                            amldata.data.items.map((el, i) => {
                                amlResult = amlResult + `${i + 1}:${el.note ? el.note : el.database}`;
                            })
                        }else{
                             amlResult = 'No record found'
                        }
                    }

                        const newScan = new ScanDouc()
                        newScan._id = mongoose.Types.ObjectId()
                        newScan.CId = mongoose.Types.ObjectId(req.payload._id)
                        newScan.ScanData = data
                        newScan.amlResult = amlResult,
                        newScan.amlData = amldata

                        const cr = await newScan.save()

                        return res.json({
                            success: true,
                            message: 'Added to the List',
                            data: cr
                        })

                }catch(err){
                    console.log(err);
                    return res.json({
                        success: false,
                        message:'some thing went wrong try again later',
                        err
                    })
                }
                
            }
        } catch (err) {
            console.log(err);
            return res.json({
                success: false,
                message:'some thing went wrong try again later',
                err
            })
        }
    },

    getAllScan:async(req,res)=>{
        try{
            const scan = await ScanDouc.find({ CId: req.payload._id})
            return res.json({
                success:true,
                data:scan
            })
        }catch(err){
            return res.status(500).json({
                success:false,
                message:'server issue',
                err
            })
        }
    },
    getOneScan:async(req,res)=>{
        try{
            const scan = await ScanDouc.findOne({ CId: req.payload._id,_id:req.params.id})
            return res.json({
                success:true,
                data:scan
            })
        }catch(err){
            return res.status(500).json({
                success:false,
                message:'server issue',
                err
            })
        }
    },
    sendInvitation: async (req, res) => {
        const value = Joi.object({
            email: Joi.string().email().required(),
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false, message: value.error.message
            })
        }

        try {
            const newVerification = new EmailVerification({
                _id: mongoose.Types.ObjectId(),
                CId: mongoose.Types.ObjectId(req.payload._id),
                email: req.body.email
            })
            const nv = await newVerification.save()

            const token = jwt.sign(nv.toObject(), 'invitation')

            return await sendMail(req, res, nv, token)
        } catch (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'some thing went wrong',
                err
            })
        }
    },
    AllInitation: async (req, res) => {
        try {
            const Invites = await EmailVerification.find({ CId: req.payload._id })
            res.json({ success: true, data:Invites })
        } catch (err) {
            console.log(err)
            res.status(400).json({ 
                success: false, 
                message: 'Some thing went wrong',
                err 
            })
        }
    },
    getOneInvite: async (req, res) => {

        try {
            const Invite = await EmailVerification.findOne({ CId: req.payload._id, _id: req.params.id })
            if (Invite) {
                return res.status(200).json({ 
                    success: true, 
                    message: 'success', 
                    data:Invite 
                })
            } else {
                return res.status(404).json({ 
                    success: false, 
                    message: 'not found' 
                })
            }

        } catch (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'some thing went wrong',
                err 
            })
        }
    },
    quickNameSearch: async (req, res) => {
        const value = Joi.object({
            name: Joi.string().required(),
            documentnumber: Joi.string(),
            dob: Joi.string(),
            country: Joi.string()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false, message: value.error.message
            })
        }
        const body = {
            apikey,
            name: req.body.name,
            documentnumber: req.body.documentnumber,
            country: req.body.country,
            dob: req.body.dob
        }

        try {
            const data = await axios({
                method: 'post',
                url: 'https://api.idanalyzer.com/aml',
                data: JSON.stringify(body)
            })
            if (data.data.error) {
                return res.status(400).json({
                    success: false,
                    message: data.data.error.message
                })
            } else {
                var amlResult = ''
                if (data.data.items.length > 0) {
                    data.data.items.map((el, i) => {
                        amlResult = amlResult + `${i + 1}:${el.note ? el.note : el.database}`;
                    })
                }else{
                     amlResult = 'No record found'
                }
                const newQuickSearch = new quickSearch()
                newQuickSearch._id = mongoose.Types.ObjectId()
                newQuickSearch.CId = mongoose.Types.ObjectId(req.payload._id)
                newQuickSearch.name = req.body.name
                newQuickSearch.dob = req.body.dob
                newQuickSearch.country = req.body.country
                newQuickSearch.amlResult = amlResult
                newQuickSearch.API = data.data.items

                const result = await newQuickSearch.save()

                return res.json({
                    success: true,
                    message: 'added to the list',
                    result
                })
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'server issue please try later',
                err
            })
        }

    },
    getAllQuickSearch: async (req, res) => {
        try {
            const search = await quickSearch.find({ CId: req.payload._id })
            if (search) {
                return res.json({
                    success: true,
                    data: search
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'not found'
                })
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'server issue',
                err
            })
        }
    },
    getOneQuickSearch: async (req, res) => {
        try {
            const search = await quickSearch.findOne({ CId: req.payload._id, _id: req.params.id })
            if (search) {
                return res.json({
                    success: true,
                    data: search
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'not found'
                })
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'server issue',
                err
            })
        }

    },
    //////////////////V!///////////////////////
    allEmpolyies: async (req, res) => {
        ////////////auth Requiared////////////
        try {
            console.log(req.payload)
            const Employees = await Employee.find({ CId: req.payload._id })
            console.log(Employees);
            res.json({ success: true, Employees })
        } catch (err) {
            console.log(err)
            res.status(400).json({ success: false, message: err })
        }
    },

    GetSingleEmployee: async (req, res) => {

        try {
            const findEmployee = await Employee.findOne({ CId: req.payload._id, _id: req.params.id })
            if (findEmployee) {
                return res.status(200).json({ success: true, message: 'find successfully', Employee: findEmployee })
            } else {
                return res.status(404).json({ success: false, message: 'not found' })
            }

        } catch (err) {
            return res.status(500).json({ success: false, message: err })
        }
    },
    deleteEmployee: async (req, res) => {
        try {
            const data = await Employee.findOne({ _id: req.params.id })
            if (data) {
                try {
                    if (data.CId == req.payload._id) {
                        await Employee.deleteOne({ _id: req.params.id })
                        return res.status(200).json({ success: true, message: 'successfully deleted' })
                    } else {
                        return res.status(401).json({ success: false, message: 'you can not delete this employee' })
                    }
                } catch (err) {
                    return res.status(500).json({ success: false, message: err })
                }
            } else {
                return res.status(404).json({ success: false, message: 'Employee not found' })
            }

        } catch (err) {
            return res.status(500).json({ success: false, message: err })
        }
    },
}