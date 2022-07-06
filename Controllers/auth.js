const jwt = require('jsonwebtoken')
const { JwtKey } = require('../Config/jwtConfig')

const getIP = require('ipware')().get_ip;
const geoip = require('geoip-lite');



const CreatToken=(data)=>{
    return new Promise((res,rej)=>{
        jwt.sign(data,JwtKey,{expiresIn:'365d'},(err,token)=>{
            if(err){
                rej(err)
            }else{
                res(token)
            }
        })
    })
}

const verifyToken=(token)=>{
    return new Promise((res,rej)=>{
        jwt.verify(token,JwtKey,(err,data)=>{
                if(err){
                    rej(err)
                }else{
                    res(data)
                }
        })
    })
}


const verify =async(req,res,next)=>{
    if(req.headers['authorization']){
        try{
            const token =req.headers['authorization'].split(' ')[1]
            if(token){
                try{
                   req.payload=await verifyToken(token)
                   req.token=token
                   next()
                }catch(err){
                    console.log(err)
                    res.status(500).json({sucess:false ,message:`${err}`})
                }
            }else{
                res.status(401).json({sucess:false ,message:'Please Provide Berar Token 1'})
            }
        }catch(err){
            res.status(401).json({sucess:false ,message:'Please Provide Berar Token 2'})
        }
        }else{
        res.status(401).json({sucess:false ,message:'Please Provide Berar Token 3'})
    }
}

const loc = (req,res,next)=>{
        try{
        req.loc =geoip.lookup(getIP(req).clientIp) 
        req.ip = getIP(req).clientIp
        console.log(getIP(req).clientIp)
        }catch(err){
            console.log(err);
        }finally{
            next() 
        }
    }

module.exports ={
    loc,
    CreatToken,
    verify,
    verifyToken,
}