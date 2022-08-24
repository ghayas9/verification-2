const express = require('express')
const { verify } = require('../Controllers/auth')
const { Register, LogIn, sendInvitation, allEmpolyies, deleteEmployee, GetSingleEmployee, ScanDouc, quickNameSearch, getAllQuickSearch, getOneQuickSearch, getAllScan, getOneScan, AllInitation, getOneInvite } = require('../Controllers/Company')
const { emailVerification } = require('../Controllers/EmailVerification')

const router = express.Router()

router.post('/register', Register)
router.post('/login', LogIn)

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