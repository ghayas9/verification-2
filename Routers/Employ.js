const express = require('express')
const { Join, AMLtesting } = require('../Controllers/Employ')

const router = express.Router()

router.post('/join/:token',Join)
router.get('/aml',AMLtesting)



module.exports = router