const express = require('express')
const { verify } = require('../Controllers/auth')
const { Register, LogIn, sendInvitation, allEmpolyies, deleteEmployee, GetSingleEmployee, ScanDouc, quickNameSearch} = require('../Controllers/Company')

const router = express.Router()

router.post('/register',Register)
router.post('/login',LogIn)
router.post('/send',verify,sendInvitation)
router.get('/employees',verify,allEmpolyies)
router.delete('/employee/:id',verify,deleteEmployee)
router.get('/employee/:id',verify,GetSingleEmployee)
router.post('/scan',ScanDouc)
router.post('/aml',verify,quickNameSearch)
// router.post('/img',uploadImage)


module.exports = router