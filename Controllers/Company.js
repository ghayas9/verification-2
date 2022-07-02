/////ERROR CODE 
//wrong password 403
//bad req 400
//server .. 500
//success 200
//not found 404
//401 - Unauthorized
const  { CreatToken } = require('./auth')
const Joi = require('joi');
const Company = require('../Models/Company')
const mongoose = require('mongoose')
const Employee = require('../Models/Employees')

const path = require('path');
const fs = require('fs');
const Jimp = require("jimp");

const IDAnalyzer = require("idanalyzer");  
const { sendMail } = require('./email');
const bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(10);

const CoreAPI = new IDAnalyzer.CoreAPI("nccNkiIeW6l6KbBPuocTG3uc5KpgcZmo","US");  


module.exports = {
    LogIn:async(req,res)=>{
        const value = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }).validate(req.body)
        if(value.error){
            return res.status(400).json({
                 success: false, message:value.error.message
            })
        }
        try{
            const data = await Company.findOne({email:req.body.email})
            if(data){
                const isPsswordcorrect = bcrypt.compareSync(req.body.password, data.password)
                if(isPsswordcorrect){
                    try{
                    const token = await CreatToken(data.toObject())
                    res.status(200).json({success:true,token})
                    }catch(err){
                        console.log(err);
                        res.status(500).json({success:false,message:err})
                    }
                    
                }else{
                    res.status(403).json({success:false,message:'wrong password'})
                }
            }else{
                res.status(403).json({success:false,message:'user not found'})
            }
        }catch(err){
            console.log(err)
            res.status(500).json({
                success: false, message:err
           })
        }

    },
    Register:async(req,res)=>{
        const value = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            contact: Joi.string().required(),
            password: Joi.string().required()
        }).validate(req.body)
        if(value.error){
            return res.status(400).json({
                 success: false, message:value.error.message
            })
        }
        const newCompany = new Company()

        
        var hash = bcrypt.hashSync(req.body.password, salt);

        newCompany._id =mongoose.Types.ObjectId()
        newCompany.name =req.body.name
        newCompany.email =req.body.email
        newCompany.contact =req.body.contact
        newCompany.password =hash

        try{
            const data = await newCompany.save()
            res.status(200).json({success:true,message:'successfully added',comp:data})
        }catch(err){
            console.log(err)
            res.status(400).json({success:false,message:err})
        }
    },
    allEmpolyies:async(req,res)=>{
        ////////////auth Requiared////////////
        try{
            console.log(req.payload)
            const Employees = await Employee.find({CId:req.payload._id})
            console.log(Employees);
            res.json({success:true,Employees})
        }catch(err){
            console.log(err)
            res.status(400).json({success:false,message:err})
        }
    },
    sendInvitation:async(req,res)=>{
        const value = Joi.object({
            email: Joi.string().email().required(),
            name: Joi.string().required(),
        }).validate(req.body)
        if(value.error){
            return res.status(400).json({
                 success: false, message:value.error.message
            })
        }
        
        try{
            const token = await CreatToken({
                name:req.body.name,
                email:req.body.email,
                CId:req.payload._id
            })

        return await sendMail(req,res,req.body.email,req.body.name,token)
        }catch(err){
            return res.status(500).json({success:false,message:err})
        }
    },
    
    deleteEmployee: async(req,res)=>{
        try{

            const data = await Employee.findOne({_id:req.params.id})
            if(data){
                try{
                    if(data.CId==req.payload._id){
                        await Employee.deleteOne({_id:req.params.id})
                        return res.status(200).json({success:true,message:'successfully deleted'})
                    }else{
                        return res.status(401).json({success:false,message:'you can not delete this employee'})
                    }
                }catch(err){
                    return res.status(500).json({success:false,message:err})
                }
            }else{
                return res.status(404).json({success:false,message:'Employee not found'})
            }
            
        }catch(err){
            return res.status(500).json({success:false,message:err})
        }
    },

    GetSingleEmployee : async(req,res)=>{

            try{
                const findEmployee = await Employee.findOne({CId:req.payload._id,_id:req.params.id})
                if(findEmployee){
                    return res.status(200).json({success:true,message:'find successfully',Employee:findEmployee})
                }else{
                    return res.status(404).json({success:false,message:'not found'})
                }
               
            }catch(err){
                return res.status(500).json({success:false,message:err})
            }   
    }
}