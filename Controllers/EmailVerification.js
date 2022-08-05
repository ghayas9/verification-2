// const IDAnalyzer = require("idanalyzer");

// const jwt=require('jsonwebtoken')

// module.exports = {
//     sendInvitition:async(req,res)=>{

//     },
//     EmailVerification:async(req,res)=>{
//         const value = Joi.object({
//             IdCard: Joi.string().required(),
//             Profile: Joi.string().required(),
            
//         }).validate(req.body)
//         if(value.error){
//             return res.status(400).json({
//                  success: false, message:value.error.message
//             })
//         }
//            jwt.verify(req.params.token,secret,(err,data)=>{
//             if(err){
//                 return res.status(400).json({
//                     success:false,
//                     message:'Invalid token'
//                 })
//             }else{
//                 const data = req.body
//                 const CoreAPI = new IDAnalyzer.CoreAPI("aCTnGY3DlbZzIYGxJEkUfqqgUSGH96Ur","US"); 
//                 CoreAPI.enableAuthentication(true, 2);
//                 const result =await CoreAPI.scan({ document_primary: data.IdCard, biometric_photo: data.Profile})
//             }
//            })

//     }
// }