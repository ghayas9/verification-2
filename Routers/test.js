const axios = require('axios')

const router = require('express').Router()
const create = async(req,res)=>{
    return res.json({
        name:'Create'
    })
}



const test = async(req,res)=>{
    try{
        const host = req.hosturl
        const result = await axios.get('http://localhost:9000/create')
        console.log(result.data);
        console.log(host);
        return res.json({
            success:true
        })
    }catch(err){
        console.log(err);
        return res.json({
            success:false
        })
    }
}

router.get('/create',create)
router.get('/test',test)

module.exports = router