const express = require('express')
const { Join, AMLtesting } = require('../Controllers/Employ')

const router = express.Router()

router.post('/join/:token',Join)
router.post('/aml',AMLtesting)



module.exports = router