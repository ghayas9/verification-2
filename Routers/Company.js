const express = require('express')
const { verify } = require('../Controllers/auth')
const { Register, LogIn, sendInvitation, allEmpolyies, deleteEmployee, GetSingleEmployee, ScanDouc, quickNameSearch, getAllQuickSearch, getOneQuickSearch, getAllScan, getOneScan, AllInitation, getOneInvite, ChangePassword, UpdateContact, getDetails } = require('../Controllers/Company')
const { ResetPassword } = require('../Controllers/Company/ForgetPassword')
const ForgetPassword = require('../Controllers/Company/ForgetPassword')
const { emailVerification } = require('../Controllers/EmailVerification')
const { upl } = require('../Controllers/upload')

const router = express.Router()
router.post('/register', Register)
router.post('/login', LogIn)

//GET Company detail //
router.get('/',verify,getDetails)

///Update Company details ////
router.post('/update/password',verify,ChangePassword)
router.post('/update/contact',verify,UpdateContact)

///forget password

router.post('/forgetpassword',ForgetPassword)
router.post('/forgetresetpassword/:token',ResetPassword)


router.get('/up',upl)
// router.get('/employees',verify,allEmpolyies)
// router.delete('/employee/:id',verify,deleteEmployee)
// router.get('/employee/:id',verify,GetSingleEmployee)


////////////////////////////////////
router.post('/aml', verify, quickNameSearch)
router.get('/quicksearch', verify, getAllQuickSearch)
router.get('/quicksearch/:id', verify, getOneQuickSearch)
/////////////////////////////////////////////////////

router.post('/scan', verify, ScanDouc)
router.get('/scan', verify, getAllScan)
router.get('/scan/:id', verify, getOneScan)
// router.post('/img',uploadImage)


router.post('/send', verify, sendInvitation)
router.post('/emailverification/:id', emailVerification)
router.get('/emailverification', verify, AllInitation)
router.get('/emailverification/:id', verify, getOneInvite)


module.exports = router