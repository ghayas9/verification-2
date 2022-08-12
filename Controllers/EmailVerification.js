const EmailVerification = require('../Models/EmailVerification')
const mongoose = require('mongoose')
const Joi = require('joi');
const axios = require('axios')
const jwt = require('jsonwebtoken')
module.exports = {
    emailVerification:async(req,res)=>{
        const reqfile = {}
        if(req.files){
            for (const x of req.files){
                reqfile[x.fieldname]=x            
            }
        }
        if(!reqfile.video){
            if(req.body.video_base64 ==undefined || req.body.video_base64 == ''){
               return res.json({
                success:false,
                message:'video is required'
               })
            }
        }else{
            req.body.video_base64 = reqfile.video.buffer.toString('base64')
        }
        //////////////////////FILE/////////////////////
        if(!reqfile.file){
            if(req.body.file_base64 ==undefined || req.body.file_base64 == ''){
                return res.json({
                    success:false,
                    message:'file is required'
                   })
            }
        }else{
            req.body.file_base64 = reqfile.file.buffer.toString('base64')
        }
        const value = Joi.object({
            name: Joi.string().required(),
            surname: Joi.string().required(),
            dob: Joi.string().required(),
            gender: Joi.string().required(),
            citizenship: Joi.string().required(),
            address: Joi.string().required(),
            post_code: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            video_base64: Joi.string().required(),
            file_base64: Joi.string().required(),
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false,
                message: value.error.message
            })
        }
            jwt.verify(req.params.id,'invitation',async(err,tokenData)=>{
                if(err){
                    return res.status(401).json({
                        success:false,
                        message:'token error'
                    })
                }else{
                    try{
                        const data = await axios({
                            method:'post',
                            url:'https://api.idanalyzer.com',
                            data:{
                                apikey:'fi8KfZUP9KgYXLYUa3wmERn8ZLiEx9v4',
                                file_base64:req.body.file_base64,
                                video_base64:req.body.video_base64
                                
                            },
                        })
                       if(data.data.error){
                        return res.status(400).json({
                            success:false,
                            message:data.error.message
                        })
                       }
                    //    if(result.face){
                    //     if(result.face.error_message){
                    //         return res.status(400).json({success:true,message:result.face.error_message})
                    //     }
                    //     }
                    }catch(err){
                        console.log(err);
                        return res.status(500).json({
                            success:false,
                            message:'server issue'
                        })
                    }
                    try{
                        const up = await EmailVerification.updateOne({
                            _id:tokenData._id
                        },{
                          $set:{
                            address : {
                                address:req.body.address,
                                post_code:req.body.post_code,
                                city:req.body.city,
                                // address_prof:'lnk'
                            },
                            personal:{
                                name:req.body.name,
                                surname:req.body.surname,
                                citizenship:req.body.citizenship,
                                dob:req.body.dob,
                                gender:req.body.gender
                            },
                            idCard:data.data.result
                          }
                        })

                        console.log(up);
                        return res.json({
                            success:true,
                            message:'douc under review'
                        })
                    }catch(err){
                        return res.status(500).json({
                            success:false,
                            message:'server issue'
                        })
                    }
                }
                
            })
    }
}