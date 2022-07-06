const Jimp = require('jimp')
const path = require('path')
var getIP = require('ipware')().get_ip;
const base64ToPng =(data)=>{
    const name = Date.now()+'.png'
    const smp = data.replace('data:image/png;base64,', '');
    const buff =new Buffer.from(smp, 'base64');
    Jimp.read(buff, (err, res) => {
      if (err) throw new Error(err);
      res.quality(100).write(path.join(__dirname,'../Public/Image/'+name));
    });
    return name
  }
const host = 'https://testing-backend-1.herokuapp.com'

const Joi = require('joi');
const mongoose = require('mongoose')

const IDAnalyzer = require("idanalyzer");  
// const CoreAPI = new IDAnalyzer.CoreAPI("nccNkiIeW6l6KbBPuocTG3uc5KpgcZmo","US");  
const CoreAPI = new IDAnalyzer.CoreAPI("wdfJl0WGWKFjwhOSHoQrMjzqaTvoui1w","US");  
const aml = new IDAnalyzer.AMLAPI("wdfJl0WGWKFjwhOSHoQrMjzqaTvoui1w","US");
CoreAPI.enableAuthentication(true, 2);

const EmployeesSchema = require('../Models/Employees');
const { verifyToken } = require('./auth');

module.exports = {
    
    Join:async(req,res) => {
        const value = Joi.object({
            IdCard: Joi.string().required(),
            Profile: Joi.string().required(),
            
        }).validate(req.body)
        if(value.error){
            return res.status(400).json({
                 success: false, message:value.error.message
            })
        }
        const data = req.body
            
        try{
            const tokenData = await verifyToken(req.params.token)
        try{
            
            const result =await CoreAPI.scan({ document_primary: data.IdCard, biometric_photo: data.Profile})
            console.log(result)
            if(result.verification){
                if(result.verification.passed===true){
                    const profile = '/image/'+base64ToPng(data.Profile)
                    const idcard = '/image/'+base64ToPng(data.IdCard)
                    const newEmployee = new EmployeesSchema()
                     newEmployee.verifyData= result
                    newEmployee.email =tokenData.email
                    newEmployee.CId=tokenData.CId
                    newEmployee._id =mongoose.Types.ObjectId()
                    newEmployee.Profile = profile
                    newEmployee.IdCard = idcard
                    const emp = await newEmployee.save()
                    console.log(emp)
                    return res.json({success:true,data:emp,message:'KYC Completed'})
                    }
            }
            if(result.face){
                if(result.face.error_message){
                    return res.status(400).json({success:true,message:result.face.error_message})
                }
            }
            if(result.error){
                return res.status(400).json({success:true,message:result.error.message})
            }
            console.log('no error kyc fail')
            return res.status(400).json({success:false,message:'KYC Not Complete Try again'})
            
        }catch(err){
            console.log(err)
            return res.status(400).json({success:false,data:err,message:'KYC Not Complete Try again'})
        }
        }catch(err){
            console.log(err)
            return res.status(401).json({success:false,message:'Invitation code error'})
        }
        
    },
    AMLtesting:async(req,res)=>{
        // const value = Joi.object({
        //     name: Joi.string().required(),
        // }).validate(req.body)
        // if(value.error){
        //     return res.status(400).json({
        //          success: false, message:value.error.message
        //     })
        // }
        
        // // aml.searchByName
        // aml.searchByIDNumber(req.body.name).then(function (response) {
        //     var message = ''
        //     if(response.items.length>0){
        //       message = response.items.map((el,i)=>{
        //             return`${i+1}:${el.note?el.note:el.database}`; 
        //         })
        //     }
        //     console.log(message);
        //   return res.json({success:false,message:response})
        // }).catch(function (err) {
        //     console.log(err.message);
        //     return res.status(500).json({err})
        // });
        // console.log(req.socket.remoteAddress);
        res.send(getIP(req))

        // aml.searchByIDNumber("AALH750218HBCLPC02").then(function (response) {
        //     console.log(response);
        // }).catch(function (err) {
        //     console.log(err.message);
        // });
    }
}