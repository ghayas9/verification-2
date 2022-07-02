const IDAnalyzer = require("idanalyzer");  
const CoreAPI = new IDAnalyzer.CoreAPI("nccNkiIeW6l6KbBPuocTG3uc5KpgcZmo","US");  

// Enable authentication module v2 to check if ID is authentic
  


module.exports = {
    verification:async(req,res)=>{
        CoreAPI.enableAuthentication(true, 2);
        // Analyze ID image by passing URL of the ID image (you may also use a local file)  
        const IdCardLink = `https://drive.google.com/uc?export=view&id=${req.files[0].fileId}`
        const ProfileLink = `https://drive.google.com/uc?export=view&id=${req.files[1].fileId}`
       try{
        const result =await CoreAPI.scan({ document_primary: IdCardLink, biometric_photo: ProfileLink })
        result.IdCardLink = IdCardLink
        result.ProfileLink =ProfileLink
        res.json({success:true,data:result})
       }catch(err){
        console.log(err)
        res.json({success:false,message:err})
       }

    },
    VerifyEmployee:async(req,res)=>{
        
    }
}