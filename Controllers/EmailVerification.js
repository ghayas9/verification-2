const EmailVerification = require('../Models/EmailVerification')
const mongoose = require('mongoose')
const Joi = require('joi');
const axios = require('axios')
const jwt = require('jsonwebtoken')

const Jimp = require('jimp')
const path = require('path')

const apikey ='fi8KfZUP9KgYXLYUa3wmERn8ZLiEx9v4'

const base64ToPng =(data)=>{
    const name = Date.now()+'.png'
    const smp = data.replace('data:image/jpeg;base64,', '');
    const buff =new Buffer.from(smp, 'base64');
    Jimp.read(buff, (err, res) => {
      if (err) throw new Error(err);
      res.quality(100).write(path.join(__dirname,'../Public/Image/'+name));
    });
    return name
  }
  
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
                message:'face is required'
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
            video:Joi.string().allow(null),
            file:Joi.string().allow(null)
        }).validate(req.body)
        console.log(req.body);
        base64ToPng(req.body.file_base64)
        if (value.error) {
            return res.status(400).json({
                success: false,
                message: value.error.message
            })
        }
            jwt.verify(req.params.id,'invitation',async(err,tokenData)=>{
                if(err){
                    console.log(err);
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
                                apikey,
                                file_base64:req.body.file_base64,
                                video_base64:req.body.video_base64,
                                outputimage:true,
                                outputface:true,
                            },
                        })
                        console.log(data);
                       if(data.data.error){
                        return res.status(400).json({
                            success:false,
                            message:data.data.error.message
                        })
                       }
                       if(data.data.face){
                            if(data.data.face.error_message){
                                return res.status(400).json({
                                    success:false,
                                    message:data.data.face.error_message
                                })
                            }
                        }
                        
                        //////AML CHECKING///////
                        try {
                            const amldata = await axios({
                                method: 'post',
                                url: 'https://api.idanalyzer.com/aml',
                                data: JSON.stringify({
                                    documentnumber: data.data.result.documentNumber,
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
                                try{

                                    ///Image link fix
                                    
                                    ///Image link fix
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
                                        API:data.data,
                                        amlResult:amlResult,
                                        amlData:amldata.data.items
                                    }
                                    })
                                    console.log(up);
                                    return res.json({
                                        success:true,
                                        message:'douc under review'
                                    })
                                }catch(err){
                                    console.log(err);
                                    return res.status(500).json({
                                        success:false,
                                        message:'server issue'
                                    })
                                }
                                
                            }
                        } catch (err) {
                            console.log(err);
                            return res.status(500).json({
                                success: false,
                                message: 'server issue please try later',
                                err
                            })
                        }
                        /////AML CHECKING///////

                    }catch(err){
                        console.log(err);
                        return res.status(500).json({
                            success:false,
                            message:'server issue'
                        })
                    }
                    
                }
                
            })
    }
}