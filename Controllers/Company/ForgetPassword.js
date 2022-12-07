const Joi = require('joi');
const jwt = require('jsonwebtoken')
const Company = require('../../Models/Company')
const mongoose = require('mongoose')

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const bcrypt = require("bcryptjs")
var salt = bcrypt.genSaltSync(10);

const forgetKey = 'forgetPassword'

const { CLIENT_ID , CLEINT_SECRET , REDIRECT_URI ,REFRESH_TOKEN ,hostUrl,email} = require('../../Config/config')
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
    );
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = {
    ForgetPassword:async(req,res)=>{
        const value = Joi.object({
            email: Joi.string().email().required()
        }).validate(req.body)
        if (value.error) {
            return res.status(400).json({
                success: false, message: value.error.message
            })
        }
        try{
            const user = await Company.findOne({ email: req.body.email })
            if (user) {
                const token = jwt.sign({
                    email:req.body.email
                },forgetKey,{expiresIn:'30m'})
                //send Email//
                try{
                    const accessToken = await oAuth2Client.getAccessToken();
                    const transport = nodemailer.createTransport({
                    service: 'gmail',
                        auth: {
                            type: 'OAuth2',
                            user: email,
                            clientId: CLIENT_ID,
                            clientSecret: CLEINT_SECRET,
                            refreshToken: REFRESH_TOKEN,
                            accessToken: accessToken,
                        },
                    });
                    const url = hostUrl+'/forget/'+token
                    const mailOptions = {
                      from: `AML <${email}>`,
                      to: req.body.email,
                      subject: 'Forget Password',
                      text: 'Forget Password',
                      html: `<div>
                                <div style="color:gray;padding:25px text-align:center">

                                </div>
                                <a style='padding:25px; color:blue' href='${url}'>Forget your Password</a>
                            </div>`
                    };
            
                     await transport.sendMail(mailOptions)
                    return res.json({
                        success:true,
                        message:'please check your email'
                    })
            
                }catch(err){
                    return res.status(400).json({
                        success:false,
                        message:'try again later',
                        err
                    })
                }
                //send Email//
            }else{
                return res.status(404).json({
                    success:false,
                    message:'Email is not registered'
                })
            }

        }catch(err){
            return res.status(400).json({
                success:false,
                message:'try again later',
                err
            })
        }
        
    },
    ResetPassword:async(req,res)=>{
        const value = Joi.object({
            email: Joi.string().email().required(),
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
        const token = req.params.token

        try{
            const data = jwt.verify(token,forgetKey)
            if(data.email==req.body.email){
                const up = await Company.updateOne({ email:data.email }, {
                    $set: {
                        password: bcrypt.hashSync(req.body.newPassword, salt)
                    }
                })

                return res.json({
                    success:true,
                    message:'password reset successfully'
                })
            }else{
                return res.status(401).json({
                    success:false,
                    message:'please provide correct email'
                })
            }
        }catch(err){
            return res.status(400).json({
                success:false,
                message:'token Error',
                err
            })
        }
    }
}
